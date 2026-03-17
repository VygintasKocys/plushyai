# AI Image Generation — Requirements

## Overview

Plushify allows users to upload a photo and transform it into an adorable plushie version using AI. This feature connects the existing generate page UI (currently mock) to a real AI image generation pipeline, adds a credits system to gate usage, persists images in Vercel Blob Storage, and powers a real gallery with before/after comparison and deletion.

---

## Functional Requirements

### FR-1: AI Image Generation

- **FR-1.1**: Users can upload a photo (JPEG/PNG, max 10 MB) and select a plushie style, then click "Generate" to produce a plushified version of the subjects in the image.
- **FR-1.2**: The system uses the **Vercel AI SDK** with the **OpenRouter provider** and the `google/gemini-2.5-flash-image` model to generate images.
- **FR-1.3**: The AI prompt must instruct the model to transform the subject(s) in the uploaded image into a plushie/stuffed toy matching the selected style, preserving pose, composition, and context.
- **FR-1.4**: Generation must be implemented as a **Next.js server action** (not an API route), keeping sensitive keys server-side.
- **FR-1.5**: While generation is in progress, the UI must show a loading/spinner state on the Generate button.

### FR-2: Credits System

- **FR-2.1**: Each user has a `credits` balance stored in the database on the `user` table.
- **FR-2.2**: New users receive **3 free credits** upon registration (default value).
- **FR-2.3**: Each generation consumes **1 credit**.
- **FR-2.4**: Before generating, the server action must verify the user has sufficient credits (`credits >= 1`). If not, return an `insufficient_credits` error.
- **FR-2.5**: Credit deduction must be **atomic** (e.g., `SET credits = credits - 1 WHERE credits > 0`) to prevent race conditions from concurrent requests.
- **FR-2.6**: When the user has insufficient credits, the UI must display a **toast notification** (via Sonner) stating they need to purchase additional credits.
- **FR-2.7**: The user's current credit balance must be visible on the **profile page**.

### FR-3: Image Storage

- **FR-3.1**: Both the **original uploaded image** and the **AI-generated image** must be persisted in Vercel Blob Storage (or local filesystem in dev).
- **FR-3.2**: All files must be stored under a `plushify/` subfolder to avoid conflicts with other projects sharing the same storage.
  - Original images: `plushify/originals/{uuid}.{ext}`
  - Generated images: `plushify/generated/{uuid}.png`
- **FR-3.3**: The existing `upload()` and `deleteFile()` utilities from `src/lib/storage.ts` must be reused.
- **FR-3.4**: Images are **automatically persisted** during generation — there is no separate "Save to Gallery" step.

### FR-4: Generation Record Persistence

- **FR-4.1**: A new `generation` database table must store metadata for each generation: user ID, title, style, original image URL, generated image URL, credit cost, and creation timestamp.
- **FR-4.2**: A generation record is created atomically alongside the credit deduction after a successful AI generation.

### FR-5: Gallery Page

- **FR-5.1**: The gallery page must display the user's **real generated images** from the database, replacing the current mock data.
- **FR-5.2**: Gallery items must show the **generated (plushified) image** as the thumbnail.
- **FR-5.3**: Clicking a gallery item opens a **detail modal** with a **before/after slider** comparing the original and generated images.
- **FR-5.4**: The before/after slider must be **draggable** — a divider that the user can slide left/right to reveal the original vs. plushified image.
- **FR-5.5**: The slider must work on both **desktop (mouse)** and **mobile (touch)**.
- **FR-5.6**: Gallery items must support **filtering by style** and **sorting by date** (newest/oldest).
- **FR-5.7**: Users must be able to **delete** a gallery item from the detail modal, which removes:
  - The original image from Blob Storage
  - The generated image from Blob Storage
  - The database record
- **FR-5.8**: Users must be able to **download** the generated image from the detail modal.

### FR-6: Authentication & Authorization

- **FR-6.1**: The generate server action must be **protected** — only authenticated users can invoke it.
- **FR-6.2**: Gallery server actions must verify the authenticated user **owns** the generation record before allowing deletion.
- **FR-6.3**: Unauthenticated requests must return an `unauthorized` error.

---

## Non-Functional Requirements

### NFR-1: Security

- **NFR-1.1**: The `OPENROUTER_API_KEY` must never be exposed to the client. All AI calls happen server-side in server actions.
- **NFR-1.2**: File uploads must be validated (type, size, filename sanitization) using the existing `validateFile()` and `sanitizeFilename()` utilities.
- **NFR-1.3**: Users must not be able to delete or access other users' gallery items (ownership verification).
- **NFR-1.4**: Credit deduction must be race-condition-safe (atomic SQL update with a `WHERE credits > 0` guard).

### NFR-2: Performance

- **NFR-2.1**: Gallery page should load with skeleton placeholders while data is fetching.
- **NFR-2.2**: Images in the gallery grid should use lazy loading.
- **NFR-2.3**: The before/after slider must be smooth (60fps) — use pointer events, not frequent re-renders.

### NFR-3: Reliability

- **NFR-3.1**: If AI generation fails after the original image has been uploaded, the server action must **clean up** the uploaded original to avoid orphaned files.
- **NFR-3.2**: If credit deduction or DB insert fails after image generation, appropriate error messages must be returned.
- **NFR-3.3**: The server action must handle OpenRouter API errors gracefully and return a user-friendly error message.

### NFR-4: Maintainability

- **NFR-4.1**: Reuse existing project utilities (`storage.ts`, `session.ts`, `db.ts`, `auth-client.ts`, `mock-data.ts` for style definitions).
- **NFR-4.2**: The before/after slider must be a **reusable component** shared between the generate result page and gallery detail modal.
- **NFR-4.3**: Server actions must use **Zod** for input validation.

### NFR-5: UX

- **NFR-5.1**: Toast messages must use the existing Sonner setup (already configured in the root layout).
- **NFR-5.2**: The generate page must clearly communicate credit cost before generation ("This will use 1 credit").
- **NFR-5.3**: Gallery deletion must include a confirmation step before proceeding.

---

## Acceptance Criteria

### AC-1: Image Generation Flow
- [ ] User uploads a JPEG/PNG image and selects a plushie style
- [ ] Clicking "Generate" invokes the server action, shows loading state
- [ ] Server action validates auth, checks credits, uploads original, calls AI, uploads result, deducts credit, saves record
- [ ] On success: generated plushie image and original are shown side-by-side with a before/after slider
- [ ] On insufficient credits: a toast notification appears saying "Insufficient credits! Please purchase more credits to continue generating."
- [ ] On AI/server error: a toast notification appears with a user-friendly error message

### AC-2: Credits System
- [ ] New users start with 3 credits (database default)
- [ ] Each successful generation deducts exactly 1 credit
- [ ] Users with 0 credits cannot generate — they receive an error toast
- [ ] Credit balance is visible on the user profile page
- [ ] Concurrent generation requests do not over-deduct credits (atomic update)

### AC-3: Blob Storage
- [ ] Original images are stored at `plushify/originals/{uuid}.{ext}` in Blob Storage
- [ ] Generated images are stored at `plushify/generated/{uuid}.png` in Blob Storage
- [ ] Storage works in both local dev (filesystem) and production (Vercel Blob)
- [ ] Deleting a gallery item removes both images from storage

### AC-4: Gallery
- [ ] Gallery page loads real generation records from the database (no mock data)
- [ ] Gallery thumbnails display actual generated images
- [ ] Clicking a gallery item opens a modal with a draggable before/after slider
- [ ] The slider works on desktop (mouse drag) and mobile (touch drag)
- [ ] Filtering by style and sorting by date work correctly
- [ ] "Delete" removes the DB record and both blob files, then closes the modal
- [ ] "Download" triggers a browser download of the generated image
- [ ] Empty gallery shows an appropriate empty state message

### AC-5: Profile
- [ ] Profile page displays the user's current credit balance from the database
- [ ] Credit balance updates after generation (visible on next profile visit)

### AC-6: Build & Lint
- [ ] `pnpm run lint` passes with no errors
- [ ] `pnpm run typecheck` passes with no errors
- [ ] Database migrations generate and apply without errors
