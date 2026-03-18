# Inngest Background Jobs — Requirements

## Overview

Plushify currently runs image generation synchronously inside a server action. When a user clicks "Generate Plushie", the browser blocks until the AI model responds, with no observability, retry logic, or rate limiting. This feature introduces **Inngest** as a durable execution engine to run image generation as a background job with full observability, automatic retries, per-user rate limiting, and concurrency control.

---

## Functional Requirements

### FR-1: Background Image Generation via Inngest

- **FR-1.1**: When a user clicks "Generate Plushie", the server action must validate input, deduct credits, upload the original image, create a `generation` record with `status: "pending"`, and dispatch an Inngest event — then return immediately.
- **FR-1.2**: An Inngest function must handle the actual AI image generation as a background job, triggered by the `plushify/image.generate` event.
- **FR-1.3**: The Inngest function must be composed of discrete, independently retryable **steps**: mark processing, fetch original image, call AI generation, upload generated image, mark completed.
- **FR-1.4**: Each step must be idempotent so that retries do not produce duplicate side effects (e.g., duplicate uploads are acceptable since they use unique UUIDs).

### FR-2: Generation Status Tracking

- **FR-2.1**: The `generation` table must include a `status` column with values: `pending`, `processing`, `completed`, `failed`.
- **FR-2.2**: The `generation` table must include a nullable `errorMessage` column to store failure reasons.
- **FR-2.3**: The `generatedImageUrl` column must become nullable, since it is not available until generation completes.
- **FR-2.4**: The Inngest function must update the generation status at each lifecycle point:
  - On function start: `pending` -> `processing`
  - On successful completion: `processing` -> `completed` (with `generatedImageUrl` set)
  - On failure (all retries exhausted): -> `failed` (with `errorMessage` set)

### FR-3: Client-Side Status Polling

- **FR-3.1**: A new `GET /api/generation/[id]` endpoint must return the current status, generated image URL (if completed), original image URL, and error message (if failed) for a given generation belonging to the authenticated user.
- **FR-3.2**: After the server action returns, the client must poll the status endpoint every 2 seconds until the generation reaches a terminal state (`completed` or `failed`).
- **FR-3.3**: The UI must display status-aware feedback during generation:
  - `pending`: "Your plushie is queued..."
  - `processing`: "AI is generating your plushie..."
  - `completed`: Display the before/after result using the existing `GenerationResult` component
  - `failed`: Display an error toast and allow the user to try again
- **FR-3.4**: Polling must be cleaned up on component unmount or when a terminal state is reached.

### FR-4: Credit Safety

- **FR-4.1**: Credits must be deducted **before** the Inngest event is dispatched, using the existing atomic SQL pattern (`WHERE credits > 0`), to prevent overspending.
- **FR-4.2**: If `inngest.send()` fails after credit deduction, the server action must refund the credit and clean up the pending generation record.
- **FR-4.3**: If the Inngest function exhausts all retries and enters the `onFailure` handler, it must refund 1 credit to the user.

### FR-5: Gallery Compatibility

- **FR-5.1**: The gallery must only display generations with `status: "completed"`.
- **FR-5.2**: The gallery delete action must handle nullable `generatedImageUrl` (only attempt to delete the file if the URL is present).

---

## Non-Functional Requirements

### NFR-1: Rate Limiting

- **NFR-1.1**: Image generation must be rate-limited to **5 runs per minute per user** to prevent abuse and control AI API costs.
- **NFR-1.2**: Rate limiting must be enforced by Inngest's built-in `rateLimit` configuration, keyed on `event.data.userId`.

### NFR-2: Concurrency Control

- **NFR-2.1**: Per-user concurrency must be limited to **2 simultaneous generation runs** to ensure fair resource distribution.
- **NFR-2.2**: Global concurrency must be limited to **10 simultaneous generation runs** to protect the AI API from being overwhelmed.
- **NFR-2.3**: Concurrency must be enforced by Inngest's built-in `concurrency` configuration.

### NFR-3: Retry & Reliability

- **NFR-3.1**: The Inngest function must retry up to **3 times** on failure, using Inngest's built-in exponential backoff.
- **NFR-3.2**: Each step within the function must be independently retryable — a failure in the AI call step must not re-execute the "mark processing" or "fetch image" steps.
- **NFR-3.3**: Step return values must be JSON-serializable (e.g., image data passed between steps as base64 strings) to support Inngest's durability model.

### NFR-4: Observability

- **NFR-4.1**: All generation runs must be visible in the Inngest dashboard with step-by-step execution traces.
- **NFR-4.2**: Failed runs must include the error message in both the Inngest dashboard and the `generation.errorMessage` database column.

### NFR-5: Developer Experience

- **NFR-5.1**: Local development must work with the Inngest Dev Server (`npx inngest-cli@latest dev`) without requiring cloud credentials.
- **NFR-5.2**: Production deployment requires `INNGEST_EVENT_KEY` and `INNGEST_SIGNING_KEY` environment variables.
- **NFR-5.3**: A `pnpm run inngest:dev` script must be available for convenience.

### NFR-6: Performance

- **NFR-6.1**: The server action must return within ~1 second (validation + credit deduction + upload + event dispatch only — no AI call).
- **NFR-6.2**: Client polling interval of 2 seconds provides a reasonable balance between responsiveness and request overhead.

---

## Acceptance Criteria

### AC-1: Happy Path Generation
- [ ] User clicks "Generate Plushie" and the page immediately shows a queued/processing status instead of blocking
- [ ] The Inngest dashboard shows the function run with all 5 steps
- [ ] When generation completes, the client automatically displays the before/after result
- [ ] The generation record in the database has `status: "completed"` and a valid `generatedImageUrl`
- [ ] The completed generation appears in the gallery

### AC-2: Credit Handling
- [ ] Credit is deducted immediately when the user clicks generate (before the background job runs)
- [ ] If the background job fails after all retries, the credit is refunded to the user
- [ ] If the Inngest event fails to send, the credit is refunded and the pending record is cleaned up

### AC-3: Rate Limiting & Concurrency
- [ ] A user who triggers 6+ generations within 1 minute has the excess requests throttled by Inngest
- [ ] A user with 3+ simultaneous generations has the 3rd queued (not rejected) until a slot opens
- [ ] No more than 10 generations run globally at the same time

### AC-4: Retry Behavior
- [ ] If the AI API call fails, Inngest automatically retries the `call-ai-generation` step (up to 3 times)
- [ ] Previously completed steps (mark-processing, fetch-image) are not re-executed on retry
- [ ] After 3 failed retries, the generation is marked as `failed` with an error message

### AC-5: Failure Handling
- [ ] A failed generation shows an error toast on the client
- [ ] Failed generations do not appear in the gallery
- [ ] The `generation.errorMessage` column contains a meaningful error description

### AC-6: Gallery Compatibility
- [ ] Gallery only shows completed generations
- [ ] Deleting a generation that has no `generatedImageUrl` (e.g., failed) does not throw an error

### AC-7: Observability
- [ ] The Inngest Dev Server dashboard displays all runs with step-level detail
- [ ] Failed steps show error information in the dashboard

### AC-8: Developer Setup
- [ ] `pnpm run inngest:dev` starts the Inngest Dev Server
- [ ] The serve endpoint at `/api/inngest` is accessible and registers the function
- [ ] No Inngest cloud credentials are required for local development
