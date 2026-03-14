# Plushify - Implementation Plan

## Overview

Transform the "Agentic Coding Starter Kit" boilerplate into **Plushify**, a SaaS application for converting user photos into plushie versions. This plan covers UI-only implementation with mock data across 6 sequential phases.

**Key files referenced throughout:**
- Mock data: `src/lib/mock-data.ts`
- Brand colors: `src/app/globals.css`
- Layout: `src/app/layout.tsx`
- Header: `src/components/site-header.tsx`
- Footer: `src/components/site-footer.tsx`
- Utilities: `src/lib/utils.ts` (reuse `cn()` for class composition)

---

## Phase 1: Boilerplate Cleanup

Remove all boilerplate-specific files, directories, and references.

- [x] Delete `src/components/setup-checklist.tsx`
- [x] Delete `src/components/starter-prompt-modal.tsx`
- [x] Delete `src/components/ui/github-stars.tsx`
- [x] Delete `src/hooks/use-diagnostics.ts`
- [x] Delete `src/app/api/diagnostics/route.ts` (and parent directory if empty)
- [x] Delete `src/app/chat/page.tsx`
- [x] Delete `src/app/chat/error.tsx`
- [x] Delete `src/app/chat/loading.tsx`
- [x] Delete `src/app/chat/` directory
- [x] Delete `src/app/api/chat/route.ts`
- [x] Delete all files in `docs/technical/` directory
- [x] Delete all files in `docs/business/` directory
- [x] Scan remaining files for imports referencing deleted files and remove them
- [x] Run `pnpm lint && pnpm typecheck` to confirm no broken references

---

## Phase 2: Foundation - Mock Data & Branding

Establish the Plushify identity, create shared mock data, and configure brand colors.

### Mock Data
- [x] Create `src/lib/mock-data.ts` with the following exports:
  - [x] `MOCK_USER` — `{ name: "Jane Doe", email: "jane@example.com", image: null, credits: 75, plan: "Pro", totalGenerations: 42, memberSince: "2025-11-15" }`
  - [x] `PRICING_PLANS` — Array of 3 plan objects (Basic $9/30cr, Pro $19/100cr popular, Elite $29/200cr) each with id, name, price, credits, popular flag, and features array
  - [x] `MOCK_GALLERY` — Array of 10 items each with id, title, style, createdAt, creditCost, and gradient color pairs (beforeFrom/beforeTo, afterFrom/afterTo)
  - [x] `PLUSHIE_STYLES` — Array of 5 style options (Classic Plushie, Kawaii, Realistic Plush, Chibi, Vintage Teddy) each with id, name, description
  - [x] `TESTIMONIALS` — Array of 3-4 testimonials each with name, role, quote, avatarInitial

### Brand Colors
- [x] Update `src/app/globals.css` — shift primary hue to soft pink (~350 oklch), accent to lavender, adjust chart/success colors to mint tones
- [x] Verify dark mode variables complement the pastel palette (muted pastels in dark mode)

### Metadata & SEO
- [x] Update `src/app/layout.tsx` — change all title/description/keywords to Plushify, update JSON-LD (type: WebApplication, category: DesignApplication), update OpenGraph and Twitter meta
- [x] Update `src/app/manifest.ts` — name: "Plushify", short_name: "Plushify", description updated
- [x] Update `src/app/sitemap.ts` — remove /chat, add /pricing, /docs, /gallery, /generate, /privacy, /terms
- [x] Update `src/app/robots.ts` — disallow /api/, /dashboard/, /profile/, /generate/, /gallery/; allow /, /pricing, /docs, /privacy, /terms
- [x] Update `src/app/not-found.tsx` — update copy and links to reference Plushify and point to `/` and `/generate`

### Additional Components
- [x] Install additional shadcn/ui components: `pnpm dlx shadcn@latest add tabs progress select`
- [x] Run `pnpm lint && pnpm typecheck` to verify clean state

---

## Phase 3: Global Components - Header, Footer, Auth, Shared UI

Rebrand all global components and create reusable shared UI pieces.

### Site Header
- [x] Rewrite `src/components/site-header.tsx`:
  - [x] Replace Bot icon and "Starter Kit" with Plushify logo using soft pastel gradient text
  - [x] Add public nav links: Home, Pricing, Docs
  - [x] Add signed-in nav links: Dashboard, Generate, Gallery (visible when mock signed-in)
  - [x] Keep ModeToggle and UserProfile dropdown
  - [x] Add mobile responsive hamburger menu (using Dialog or sheet pattern)

### User Profile Dropdown
- [x] Modify `src/components/auth/user-profile.tsx`:
  - [x] Add optional `mockMode` prop that bypasses `useSession` and renders using MOCK_USER
  - [x] Display credits badge in the dropdown menu
  - [x] Add "Generate" link in the dropdown menu pointing to /generate

### Site Footer
- [x] Rewrite `src/components/site-footer.tsx`:
  - [x] Plushify branding with tagline ("Transform your photos into adorable plushies")
  - [x] 4-column link layout: Product (Generate, Gallery, Pricing), Company (About, Blog — placeholder hrefs), Legal (Privacy, Terms), Support (Docs, Contact — placeholder href)
  - [x] Copyright line: "2026 Plushify. All rights reserved."

### Auth Page Restyling
- [x] Restyle `src/app/(auth)/login/page.tsx` — title: "Welcome back to Plushify", add Plushify logo, pastel card styling
- [x] Restyle `src/app/(auth)/register/page.tsx` — title: "Join Plushify", add tagline about plushie generation
- [x] Restyle `src/app/(auth)/forgot-password/page.tsx` — Plushify branding and pastel styling
- [x] Restyle `src/app/(auth)/reset-password/page.tsx` — Plushify branding and pastel styling
- [x] Update `src/components/auth/sign-in-button.tsx` — remove any boilerplate-specific text
- [x] Update `src/components/auth/sign-up-form.tsx` — remove any boilerplate-specific text

### Shared Components
- [x] Create `src/components/gradient-placeholder.tsx`:
  - [x] Props: `fromColor`, `toColor`, `className`, `label` (optional overlay text)
  - [x] Renders a rounded div with CSS gradient background and optional centered label
  - [x] Supports aspect-ratio via className
- [x] Create `src/components/credit-badge.tsx`:
  - [x] Props: `credits`, `variant` ("inline" | "card")
  - [x] Displays credit count with a coin/star icon from lucide-react
- [x] Create `src/components/before-after-card.tsx`:
  - [x] Props: before gradient colors, after gradient colors, labels
  - [x] Side-by-side display with "Original" and "Plushified" labels
  - [x] Uses `GradientPlaceholder` internally
- [x] Run `pnpm lint && pnpm typecheck` to verify

---

## Phase 4: Public Pages - Landing, Pricing, Legal

Build all public-facing pages that don't require authentication.

### Landing Page
- [x] Rewrite `src/app/page.tsx` (convert to Server Component — remove "use client"):
  - [x] **Hero section**: Large heading "Turn Any Photo Into an Adorable Plushie", descriptive subtext, two CTA buttons ("Get Started Free" -> /register, "See Examples" -> #showcase), hero gradient placeholder showing before/after
  - [x] **Showcase section** (`id="showcase"`): Grid of 4-6 `BeforeAfterCard` components with varied gradient color pairs
  - [x] **Features section**: 3x2 grid with lucide icons — Sparkles (AI-Powered), Camera (Any Photo), Palette (Multiple Styles), Zap (High Quality), Clock (Fast Generation), Download (Download & Share)
  - [x] **How it Works section**: 3 numbered steps with icons — Upload (Upload icon), AI Transforms (Wand2 icon), Download (Download icon) — with connecting visual flow
  - [x] **Testimonials section**: 3 testimonial cards from TESTIMONIALS mock data with avatar initial, name, role, quote
  - [x] **Pricing preview section**: Brief heading with link to /pricing, optionally showing the 3 plan names and prices
  - [x] **Final CTA section**: "Ready to Plushify?" heading with "Get Started" button -> /register

### Pricing Page
- [x] Create `src/app/pricing/page.tsx` (Server Component):
  - [x] Export metadata with title: "Pricing | Plushify"
  - [x] Page heading: "Simple, Credit-Based Pricing" with subtext explaining the credits model
  - [x] 3 pricing cards from PRICING_PLANS using shadcn Card component
  - [x] Pro plan highlighted with "Most Popular" badge and accent border/ring
  - [x] Each card: plan name, "$X/month", "Y credits" callout, feature list with check icons, CTA button ("Get Started" / "Go Pro" / "Go Elite")
  - [x] "How Credits Work" section: 3 bullet points (1 credit = 1 generation, credits reset monthly, unused credits don't roll over)
  - [x] FAQ section at bottom with 4-6 questions using expandable details/summary or custom accordion

### Legal Pages
- [x] Create `src/app/privacy/page.tsx` (Server Component):
  - [x] Export metadata with title: "Privacy Policy | Plushify"
  - [x] Formatted privacy policy text with sections: Information We Collect, How We Use Information, Data Storage, Third-Party Services, Your Rights, Contact
  - [x] Prose-styled with proper heading hierarchy
- [x] Create `src/app/terms/page.tsx` (Server Component):
  - [x] Export metadata with title: "Terms of Service | Plushify"
  - [x] Formatted terms text with sections: Acceptance of Terms, Service Description, User Accounts, Credits and Payments, Intellectual Property, Limitation of Liability, Termination, Contact
  - [x] Prose-styled with proper heading hierarchy
- [x] Run `pnpm lint && pnpm typecheck` to verify

---

## Phase 5: Protected Pages - Dashboard, Generate, Gallery, Profile

Build all authenticated user pages using mock data to simulate signed-in state.

### Dashboard
- [x] Rewrite `src/app/dashboard/page.tsx` (Client Component):
  - [x] Remove diagnostics hook and real auth session checks
  - [x] Import and use MOCK_USER and MOCK_GALLERY from mock-data.ts
  - [x] Welcome header: "Welcome back, Jane!" with Pro plan badge
  - [x] 4 stat cards in a responsive row: Credits Remaining (75/100), Total Generations (42), This Month (8), Plan (Pro)
  - [x] Credit usage progress bar (shadcn Progress component) showing 75/100
  - [x] Large "Create New Plushie" CTA button linking to /generate
  - [x] "Recent Generations" section: grid of 4 most recent MOCK_GALLERY items as clickable cards with gradient placeholders, linking to /gallery

### Generate Page
- [x] Create `src/components/generate/upload-zone.tsx`:
  - [x] Dashed border drop zone with Upload icon and text ("Drag & drop your image here or click to browse")
  - [x] Hidden file input triggered on click, accepts image/png, image/jpeg
  - [x] onDragOver/onDrop handlers for drag-and-drop
  - [x] When file selected: show image preview using URL.createObjectURL
  - [x] "Change Image" button to re-select
- [x] Create `src/components/generate/style-selector.tsx`:
  - [x] Renders PLUSHIE_STYLES as a grid of selectable cards
  - [x] Selected card highlighted with accent border
  - [x] Each card: style name, description
  - [x] Props: selectedStyle, onSelectStyle callback
- [x] Create `src/components/generate/generation-result.tsx`:
  - [x] Before panel: shows the uploaded image preview
  - [x] After panel: shows a warm gradient placeholder as the "generated" result
  - [x] Action buttons: "Save to Gallery", "Download", "Generate Another"
  - [x] Props: beforeImageUrl, onSave, onDownload, onReset callbacks
- [x] Create `src/app/generate/page.tsx` (Client Component):
  - [x] State management: selectedFile, selectedStyle, isGenerating, showResult
  - [x] Upload section using UploadZone component
  - [x] Style selection using StyleSelector component
  - [x] Settings panel: size Select dropdown (512x512, 1024x1024), quality toggle
  - [x] Credit cost: "This will use 1 credit. You have 75 remaining." from MOCK_USER
  - [x] Generate button: primary, disabled until file selected, onClick triggers mock generation
  - [x] Mock generation: set isGenerating=true, setTimeout 2 seconds, set showResult=true
  - [x] Result display using GenerationResult component
  - [x] "Generate Another" resets all state

### Gallery Page
- [x] Create `src/components/gallery/gallery-card.tsx`:
  - [x] Renders a single gallery item as a card
  - [x] Gradient placeholder with aspect-square ratio
  - [x] Title, style badge (using shadcn Badge), date formatted
  - [x] Hover overlay with semi-transparent background and "View" button
  - [x] Props: gallery item data, onClick callback
- [x] Create `src/components/gallery/gallery-detail-modal.tsx`:
  - [x] shadcn Dialog component
  - [x] Full before/after comparison using BeforeAfterCard
  - [x] Metadata: title, style, date created, credit cost
  - [x] Action buttons: "Download" and "Delete" (UI only, no real functionality)
  - [x] Props: gallery item (or null), open state, onClose callback
- [x] Create `src/app/gallery/page.tsx` (Client Component):
  - [x] Import MOCK_GALLERY from mock-data.ts
  - [x] State: selectedStyle filter, sortOrder, selectedItem for modal
  - [x] Header: "Your Gallery" with total count badge
  - [x] Filter bar: style Select dropdown (All + each style), sort Select (Newest/Oldest)
  - [x] Filter/sort logic applied to MOCK_GALLERY
  - [x] Responsive grid: `grid-cols-2 md:grid-cols-3 lg:grid-cols-4` with gap
  - [x] Render GalleryCard for each filtered item
  - [x] GalleryDetailModal opens when a card is clicked

### Profile Page
- [x] Update `src/app/profile/page.tsx`:
  - [x] Remove real auth checks, import MOCK_USER from mock-data.ts
  - [x] Account overview card: avatar (initials fallback), name, email, plan badge (Pro), member since date
  - [x] Subscription section: current plan name, credits progress (75/100 using Progress component), next renewal date (mock)
  - [x] Credit history section: mock table with 5-6 rows showing date, description (e.g., "Plushie Generation", "Pro Plan - 100 Credits"), credits (+/-), balance
  - [x] Account settings section: display name and email (read-only for now)
  - [x] Danger zone card: "Delete Account" destructive button (UI only)
- [x] Run `pnpm lint && pnpm typecheck` to verify

---

## Phase 6: Documentation & Final Polish

Build documentation pages and perform a final quality sweep.

### Documentation Pages
- [x] Create `src/app/docs/layout.tsx`:
  - [x] Sidebar navigation with links: Getting Started, Credits, FAQ, API Reference
  - [x] Active link highlighting based on current path
  - [x] Main content area with prose-appropriate max-width
  - [x] Responsive: sidebar collapses on mobile
- [x] Create `src/app/docs/page.tsx` (Server Component):
  - [x] Export metadata with title: "Documentation | Plushify"
  - [x] Overview heading and brief description of Plushify
  - [x] Card-based links to each documentation sub-page with descriptions
- [x] Create `src/app/docs/getting-started/page.tsx`:
  - [x] Step-by-step guide: creating an account, purchasing credits, uploading first photo, choosing a style, generating a plushie, saving to gallery
- [x] Create `src/app/docs/credits/page.tsx`:
  - [x] Explain credit system: what credits are, how they're used
  - [x] Pricing table showing all 3 tiers
  - [x] Credit costs per feature (1 credit per standard generation, etc.)
  - [x] Credit renewal and expiration policies
- [x] Create `src/app/docs/faq/page.tsx`:
  - [x] 6-8 common questions with answers in expandable accordion sections
  - [x] Topics: supported image formats, generation time, credit refunds, image quality, privacy, account deletion
- [x] Create `src/app/docs/api/page.tsx`:
  - [x] Placeholder page: "API documentation coming soon"
  - [x] Brief description of planned API capabilities
  - [x] "Available on Elite plan" callout

### Final Cleanup & Verification
- [x] Search entire codebase for remaining boilerplate references: "Starter Kit", "Agentic Coding", "Boilerplate", "Leon van Zyl", "leonvanzyl"
- [x] Remove any dead imports, unused variables, or orphaned references
- [x] Verify dark mode works correctly on every page
- [x] Verify all pages are mobile responsive with no layout breakage
- [x] Verify soft pastel color theme renders correctly in both light and dark modes
- [x] Run `pnpm lint && pnpm typecheck` — must pass with zero errors
- [x] Run `pnpm build:ci` — must complete successfully
