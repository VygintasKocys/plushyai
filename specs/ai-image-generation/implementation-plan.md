# AI Image Generation — Implementation Plan

## Phase 1: Dependencies & Database Schema

### 1.1 Install packages
- [x] Run `pnpm add ai @openrouter/ai-sdk-provider` to install the Vercel AI SDK and OpenRouter provider

### 1.2 Add `credits` column to `user` table
- [x] In `src/lib/schema.ts`, import `integer` from `drizzle-orm/pg-core`
- [x] Add `credits: integer("credits").default(3).notNull()` to the `user` table definition

### 1.3 Create `generation` table
- [x] In `src/lib/schema.ts`, import `uuid` from `drizzle-orm/pg-core`
- [x] Define a new `generation` table with columns:
  - `id`: `uuid("id").defaultRandom().primaryKey()`
  - `userId`: `text("user_id").notNull().references(() => user.id, { onDelete: "cascade" })`
  - `title`: `text("title").notNull()`
  - `style`: `text("style").notNull()`
  - `originalImageUrl`: `text("original_image_url").notNull()`
  - `generatedImageUrl`: `text("generated_image_url").notNull()`
  - `creditCost`: `integer("credit_cost").default(1).notNull()`
  - `createdAt`: `timestamp("created_at").defaultNow().notNull()`
- [x] Add an index on `userId` for the generation table

### 1.4 Generate and run migrations
- [x] Run `pnpm run db:generate` to create the migration files
- [x] Run `pnpm run db:migrate` to apply the migration to the database
- [x] Verify the migration succeeded (no errors)

---

## Phase 2: Server Action — Generate Plushie Image

### 2.1 Create the server action file
- [x] Create `src/app/generate/actions.ts` with `"use server"` directive

### 2.2 Implement authentication check
- [x] Import `auth` from `@/lib/auth` and `headers` from `next/headers`
- [x] Get session via `auth.api.getSession({ headers: await headers() })`
- [x] Return `{ error: "unauthorized" }` if no session

### 2.3 Implement input validation
- [x] Define a Zod schema for the `FormData` input: `style` (string, one of the valid style IDs) and `imageFile` (File)
- [x] Parse and validate the incoming FormData
- [x] Return validation errors if input is invalid

### 2.4 Implement credit check
- [x] Import `db` from `@/lib/db` and `user` table from `@/lib/schema`
- [x] Query the current user's credits: `SELECT credits FROM user WHERE id = ?`
- [x] If `credits < 1`, return `{ error: "insufficient_credits" }`

### 2.5 Upload original image to Blob Storage
- [x] Read the uploaded File into a Buffer (`Buffer.from(await file.arrayBuffer())`)
- [x] Generate a unique filename: `${crypto.randomUUID()}.${extension}`
- [x] Call `upload(buffer, filename, "plushify/originals")` from `@/lib/storage`
- [x] Store the returned `url` for the generation record

### 2.6 Call AI to generate the plushified image
- [x] Import `createOpenRouter` from `@openrouter/ai-sdk-provider` and `generateImage` from `ai`
- [x] Create the OpenRouter client: `createOpenRouter({ apiKey: process.env.OPENROUTER_API_KEY })`
- [x] Look up the style name from `PLUSHIE_STYLES` based on the style ID
- [x] Call `generateImage()` with:
  - `model: openrouter.imageModel("google/gemini-2.5-flash-image")`
  - `prompt: { text: "Transform the subject(s)... into ${styleName} plushie...", images: [originalBuffer] }`
- [x] Handle errors: if generation fails, delete the uploaded original image and return `{ error: "generation_failed" }`

### 2.7 Upload generated image to Blob Storage
- [x] Convert the base64 image response to a Buffer: `Buffer.from(image.base64, "base64")`
- [x] Generate a unique filename: `${crypto.randomUUID()}.png`
- [x] Call `upload(generatedBuffer, filename, "plushify/generated")` from `@/lib/storage`

### 2.8 Deduct credit atomically
- [x] Execute atomic SQL: `UPDATE user SET credits = credits - 1 WHERE id = ? AND credits > 0`
- [x] Verify the update affected exactly 1 row (guard against race condition)
- [x] If no row was affected, clean up uploaded files and return `{ error: "insufficient_credits" }`

### 2.9 Insert generation record
- [x] Insert into the `generation` table with: `userId`, `title` (auto-generated from style), `style`, `originalImageUrl`, `generatedImageUrl`, `creditCost: 1`
- [x] Return `{ success: true, generation: { id, originalImageUrl, generatedImageUrl, style, createdAt } }`

---

## Phase 3: Before/After Slider Component

### 3.1 Create the slider component
- [x] Create `src/components/before-after-slider.tsx` as a client component (`"use client"`)

### 3.2 Implement the slider structure
- [x] Props: `beforeImageUrl: string`, `afterImageUrl: string`, `beforeLabel?: string` (default "Original"), `afterLabel?: string` (default "Plushified"), `className?: string`
- [x] Render two images absolutely positioned in a container
- [x] The "after" image is clipped using `clip-path: inset(0 0 0 ${position}%)` or `width` percentage
- [x] A vertical divider line at the slider position

### 3.3 Implement drag interaction
- [x] Track slider position as a percentage (0–100) in state, default 50
- [x] Use `onPointerDown` on the divider to start dragging
- [x] Use `onPointerMove` (on the container) to update position based on cursor X relative to container bounds
- [x] Use `onPointerUp` to stop dragging
- [x] Set `touch-action: none` on the container to prevent scroll interference on mobile

### 3.4 Style the slider
- [x] Add "Original" / "Plushified" labels on the left/right sides
- [x] Style the divider handle (small circle or grabber icon on the divider line)
- [x] Ensure the component is responsive and fills its container

---

## Phase 4: Update Generate Page

### 4.1 Wire the generate page to the server action
- [x] In `src/app/generate/page.tsx`, import `generatePlushie` from `./actions`
- [x] In `handleGenerate`, build a `FormData` with the selected file and style
- [x] Call the server action with the FormData
- [x] Remove the mock `setTimeout` logic

### 4.2 Handle server action responses
- [x] On `insufficient_credits` error: call `toast.error("Insufficient credits! Please purchase more credits to continue generating.")`
- [x] On `generation_failed` error: call `toast.error("Image generation failed. Please try again.")`
- [x] On `unauthorized` error: redirect to `/login`
- [x] On success: store the returned generation data in state and show the result

### 4.3 Add generated image URLs to result state
- [x] Add state: `generatedResult` containing `originalImageUrl` and `generatedImageUrl`
- [x] Pass both URLs to the `GenerationResult` component

### 4.4 Update `GenerationResult` component
- [x] In `src/components/generate/generation-result.tsx`:
  - Add `afterImageUrl: string` prop
  - Replace the `GradientPlaceholder` with an `<img>` showing `afterImageUrl`
  - Replace the side-by-side grid with the `BeforeAfterSlider` component
  - Remove the "Save to Gallery" button (images are auto-saved)
  - Keep "Download" (wire to actual download of `afterImageUrl`) and "Generate Another"

---

## Phase 5: Gallery Server Actions

### 5.1 Create gallery actions file
- [x] Create `src/app/gallery/actions.ts` with `"use server"` directive

### 5.2 Implement `getGalleryItems` action
- [x] Authenticate the user via `auth.api.getSession()`
- [x] Query the `generation` table: `SELECT * FROM generation WHERE userId = ? ORDER BY createdAt DESC`
- [x] Return the array of generation records

### 5.3 Implement `deleteGalleryItem` action
- [x] Accept `generationId: string` as input
- [x] Authenticate the user
- [x] Query the generation record and verify `userId` matches the authenticated user
- [x] If not found or not owned, return `{ error: "not_found" }`
- [x] Delete the original image from Blob Storage via `deleteFile(originalImageUrl)`
- [x] Delete the generated image from Blob Storage via `deleteFile(generatedImageUrl)`
- [x] Delete the record from the `generation` table
- [x] Return `{ success: true }`

---

## Phase 6: Update Gallery Page & Components

### 6.1 Update gallery page to fetch real data
- [x] In `src/app/gallery/page.tsx`, import `getGalleryItems` from `./actions`
- [x] Add state for gallery items and loading state
- [x] Fetch gallery items on mount using `useEffect` + the server action
- [x] Replace `MOCK_GALLERY` with real data
- [x] Show skeleton loading state while fetching
- [x] Show empty state when no items exist ("No plushie generations yet. Go create your first one!")

### 6.2 Update gallery card component
- [x] In `src/components/gallery/gallery-card.tsx`:
  - Update the `GalleryItem` interface to match the `generation` table schema (`id`, `title`, `style`, `createdAt`, `generatedImageUrl`, `originalImageUrl`)
  - Replace `GradientPlaceholder` with `<img src={item.generatedImageUrl}>` for the thumbnail
  - Keep the hover overlay and metadata display

### 6.3 Update gallery detail modal
- [x] In `src/components/gallery/gallery-detail-modal.tsx`:
  - Update the `GalleryItem` interface to match the `generation` table schema
  - Replace `BeforeAfterCard` (gradient) with the `BeforeAfterSlider` component using `item.originalImageUrl` and `item.generatedImageUrl`
  - Wire the "Delete" button to call `deleteGalleryItem` server action
  - Add a confirmation step before deletion (e.g., `window.confirm()` or a toast confirmation)
  - On successful delete, call `onClose()` and trigger a gallery refresh
  - Wire the "Download" button to create an anchor element and trigger download of `item.generatedImageUrl`

### 6.4 Update filtering and sorting
- [x] Update style filtering to work with the `style` field from the generation record (which stores the style name string)
- [x] Ensure date sorting works with the `createdAt` timestamp from the database

### 6.5 Add gallery refresh mechanism
- [x] Add an `onDelete` callback prop to `GalleryDetailModal`
- [x] When delete succeeds, call `onDelete` to re-fetch the gallery items in the parent page

---

## Phase 7: Update User Profile

### 7.1 Pass real credits to profile page
- [x] In `src/app/profile/page.tsx`, query the user's `credits` from the database after `requireAuth()`
- [x] Pass the `credits` value to the `ProfileContent` component

### 7.2 Display real credits in profile content
- [x] In `src/components/profile-content.tsx`, accept a `credits` prop
- [x] Replace any hardcoded/mock credit display with the real `credits` value
- [x] Optionally query the count of generations from the DB to show total generations

---

## Phase 8: Cleanup & Verification

### 8.1 Remove mock data dependencies
- [x] Remove the `MOCK_GALLERY` import and usage from the gallery page
- [x] Remove the `GradientPlaceholder` usage from generation result (if fully replaced)
- [x] Update or remove `src/components/before-after-card.tsx` if it's fully replaced by the slider
  - Note: `before-after-card.tsx` is still used by the landing page (`src/app/page.tsx`), so it is kept

### 8.2 Lint and type check
- [x] Run `pnpm run lint` and fix any issues
- [x] Run `pnpm run typecheck` and fix any type errors

### 8.3 Manual verification
- [ ] Verify the full generate flow: upload → generate → view result with slider
- [ ] Verify insufficient credits shows toast error
- [ ] Verify gallery loads real images from DB
- [ ] Verify gallery before/after slider works (desktop + mobile drag)
- [ ] Verify gallery delete removes images from storage and record from DB
- [ ] Verify gallery download triggers browser file download
- [ ] Verify profile shows correct credit balance
- [ ] Verify new user registration starts with 3 credits
