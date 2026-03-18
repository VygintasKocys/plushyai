# Inngest Background Jobs — Implementation Plan

## Summary

Move image generation from a synchronous server action into an Inngest background function with status tracking, polling, retries, rate limiting, and concurrency control.

---

## Phase 1: Install Inngest & Setup Client

**Goal**: Get Inngest installed and create the typed client.

- [x] Install the `inngest` package: `pnpm add inngest`
- [x] Add `inngest:dev` script to `package.json`: `"inngest:dev": "npx inngest-cli@latest dev"`
- [x] Create `src/inngest/client.ts` with:
  - Inngest client initialized with `id: "plushify"`
  - Typed event schema for `plushify/image.generate` containing: `generationId` (string), `userId` (string), `style` (string), `styleName` (string), `originalImageUrl` (string)
- [x] Add Inngest env vars to `env.example`: `INNGEST_EVENT_KEY`, `INNGEST_SIGNING_KEY`

**Files created**: `src/inngest/client.ts`
**Files modified**: `package.json`, `env.example`

---

## Phase 2: Database Schema Changes

**Goal**: Add status tracking columns to the `generation` table.

- [x] In `src/lib/schema.ts`, add `status` column to `generation` table: `text("status").default("pending").notNull()`
- [x] In `src/lib/schema.ts`, add `errorMessage` column to `generation` table: `text("error_message")` (nullable)
- [x] In `src/lib/schema.ts`, make `generatedImageUrl` nullable by removing `.notNull()`
- [x] Generate the migration: `pnpm run db:generate`
- [x] Apply the migration: `pnpm run db:migrate`

**Files modified**: `src/lib/schema.ts`

---

## Phase 3: Create the Inngest Function

**Goal**: Implement the background generation function with steps, flow control, and failure handling.

- [x] Create `src/inngest/functions/generate-plushie.ts` with `inngest.createFunction()`:
  - **Function config**:
    - `id: "generate-plushie"`
    - `retries: 3`
    - `concurrency: [{ limit: 2, key: "event.data.userId", scope: "fn" }, { limit: 10, scope: "fn" }]`
    - `rateLimit: { limit: 5, period: "1m", key: "event.data.userId" }`
  - **Trigger**: `{ event: "plushify/image.generate" }`
  - **Step 1** — `mark-processing`: Update generation record `status` to `"processing"`
  - **Step 2** — `fetch-original-image`: Fetch the original image from `originalImageUrl` (construct absolute URL using `NEXT_PUBLIC_APP_URL` for local dev relative paths). Return image data as base64 string.
  - **Step 3** — `call-ai-generation`: Create OpenRouter client, call `generateImage()` with the plushie prompt and original image. Return generated image as base64 string.
  - **Step 4** — `upload-generated-image`: Convert base64 back to Buffer, upload to `plushify/generated/{uuid}.png` via `upload()` from `@/lib/storage`. Return the URL.
  - **Step 5** — `mark-completed`: Update generation record with `status: "completed"` and `generatedImageUrl`.
- [x] Add `onFailure` handler to:
  - Update generation record with `status: "failed"` and `errorMessage`
  - Refund 1 credit to the user: `UPDATE user SET credits = credits + 1 WHERE id = userId`
- [x] Create `src/inngest/functions/index.ts` as barrel export for `generatePlushieFunction`

**Files created**: `src/inngest/functions/generate-plushie.ts`, `src/inngest/functions/index.ts`

---

## Phase 4: Create the Inngest Serve Route

**Goal**: Wire up the Inngest HTTP handler so the Dev Server (and production) can discover and invoke functions.

- [x] Create `src/app/api/inngest/route.ts`:
  - Import `serve` from `inngest/next`
  - Import `inngest` client from `@/inngest/client`
  - Import `generatePlushieFunction` from `@/inngest/functions`
  - Export `{ GET, POST, PUT }` from `serve({ client: inngest, functions: [generatePlushieFunction] })`

**Files created**: `src/app/api/inngest/route.ts`

---

## Phase 5: Create the Generation Status API

**Goal**: Provide a polling endpoint for the client to check generation progress.

- [x] Create `src/app/api/generation/[id]/route.ts` with a `GET` handler:
  - Authenticate the request using `auth.api.getSession()`
  - Query `generation` table for the record matching `id` param AND `userId = session.user.id`
  - Return 401 if not authenticated, 404 if record not found or doesn't belong to user
  - Return JSON: `{ status, generatedImageUrl, originalImageUrl, errorMessage }`

**Files created**: `src/app/api/generation/[id]/route.ts`

---

## Phase 6: Refactor the Server Action

**Goal**: Slim down `generatePlushie` to validate, deduct credits, and dispatch an Inngest event.

- [x] In `src/app/generate/actions.ts`, keep steps 1-5 unchanged (auth, validation, credit check, upload original, atomic credit deduction)
- [x] Remove the AI generation logic (OpenRouter call, generated image upload)
- [x] After credit deduction, insert a `generation` record with:
  - `status: "pending"`
  - `generatedImageUrl: null` (omitted)
  - All other fields as before (userId, title, style, originalImageUrl, creditCost)
- [x] Call `inngest.send()` with event `"plushify/image.generate"` and data: `{ generationId, userId, style, styleName, originalImageUrl }`
- [x] Wrap `inngest.send()` in try/catch — on failure:
  - Refund the credit: `UPDATE user SET credits = credits + 1 WHERE id = userId`
  - Delete the pending generation record
  - Delete the uploaded original image
  - Return `{ error: "generation_failed" }`
- [x] Change the success return to `{ success: true, generationId: record.id }` (no longer returns image URLs)
- [x] Remove unused imports (`createOpenRouter`, `generateImage`)

**Files modified**: `src/app/generate/actions.ts`

---

## Phase 7: Update the Client Page

**Goal**: Replace the synchronous wait with a polling-based status UI.

- [x] In `src/app/generate/page.tsx`, add new state:
  - `generationId: string | null`
  - `generationStatus: "pending" | "processing" | "completed" | "failed" | null`
- [x] Update `handleGenerate`:
  - On success, set `generationId` from the server action response
  - Set `generationStatus` to `"pending"`
  - Do NOT set `isGenerating` to false yet — keep the loading state until terminal status
- [x] Add a `useEffect` that polls when `generationId` is set and status is non-terminal:
  - Call `GET /api/generation/[generationId]` every 2 seconds
  - Update `generationStatus` from the response
  - On `"completed"`: set `generatedResult` with the URLs, set `isGenerating` to false, clear polling
  - On `"failed"`: show error toast with `errorMessage`, set `isGenerating` to false, clear polling
  - Clean up interval on unmount
- [x] Update the generating UI to show status-aware messages:
  - `pending`: "Your plushie is queued..."
  - `processing`: "AI is generating your plushie..."
  - Replace the simple `Loader2` spinner with a status card showing the current phase

**Files modified**: `src/app/generate/page.tsx`

---

## Phase 8: Update Gallery for Compatibility

**Goal**: Ensure gallery works with nullable `generatedImageUrl` and the new status column.

- [x] In `src/app/gallery/actions.ts` (`getGalleryItems`): add a `WHERE status = 'completed'` filter to the query
- [x] In `src/app/gallery/actions.ts` (`deleteGalleryItem`): guard `deleteFile(record.generatedImageUrl)` with a null check — only call if URL exists
- [x] Fix any TypeScript errors in gallery components caused by `generatedImageUrl` becoming `string | null`:
  - `src/app/gallery/page.tsx`
  - `src/components/gallery/gallery-card.tsx`
  - `src/components/gallery/gallery-detail-modal.tsx`

**Files modified**: `src/app/gallery/actions.ts`, and any gallery components with type errors

---

## Phase 9: Lint, Typecheck & Verify

**Goal**: Ensure everything compiles and passes checks.

- [x] Run `pnpm run lint` and fix any issues
- [x] Run `pnpm run typecheck` and fix any type errors
- [ ] Verify the Inngest serve endpoint registers correctly:
  - Start Inngest Dev Server: `npx inngest-cli@latest dev`
  - Start Next.js dev server
  - Confirm the function appears in the Inngest dashboard at `http://localhost:8288`
- [ ] Manual smoke test:
  - Generate a plushie and confirm the background flow works end-to-end
  - Confirm the result appears in the gallery
  - Confirm failed generations show error feedback and refund credits
