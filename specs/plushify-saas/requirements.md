# Plushify - Requirements Specification

## Project Overview

**App Name:** Plushify
**Description:** A SaaS application that allows users to upload images of themselves, friends, family, or pets and uses AI to convert those images into adorable plushie versions.
**Current Phase:** UI/UX only (mock data, no backend logic)
**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS 4, shadcn/ui
**Design Direction:** Soft pastel color palette (soft pink, lavender, mint)

---

## Functional Requirements

### FR-01: Landing Page (`/`)

The landing page serves as the primary marketing page for Plushify and must effectively communicate the product's value proposition.

- Display a hero section with a compelling headline, descriptive subtext, and two CTA buttons ("Get Started" and "See Examples")
- Show a before/after showcase grid demonstrating the plushie transformation (using gradient placeholders)
- Present a features section with 6 items and icons (AI-Powered, Any Photo, Multiple Styles, High Quality, Fast Generation, Download & Share)
- Include a "How it Works" section with a 3-step visual flow (Upload, AI Transforms, Download)
- Display a testimonials section with mock customer quotes
- Show a pricing preview section linking to the full pricing page
- End with a final CTA section ("Ready to Plushify?") driving sign-up

### FR-02: Authentication Pages

All existing auth pages must be restyled to match the Plushify brand while preserving existing component logic for future backend integration.

- **Login** (`/login`): Updated title ("Welcome back to Plushify"), Plushify logo, pastel styling
- **Register** (`/register`): Updated title ("Join Plushify"), tagline about plushie generation
- **Forgot Password** (`/forgot-password`): Plushify branding and styling
- **Reset Password** (`/reset-password`): Plushify branding and styling
- Auth form components (`sign-in-button.tsx`, `sign-up-form.tsx`) must have boilerplate text removed and Plushify copy added

### FR-03: Pricing Page (`/pricing`)

A dedicated pricing page displaying the credit-based pricing model.

- Display three pricing tier cards side-by-side:
  - **Basic:** $9/month, 30 credits — Standard quality, 720p exports, Email support
  - **Pro:** $19/month, 100 credits — HD quality, 1080p exports, Priority support, Batch processing (highlighted as "Most Popular")
  - **Elite:** $29/month, 200 credits — Ultra HD quality, 4K exports, Priority support, Batch processing, API access, Custom styles
- Each card includes: plan name, price, credit amount, feature list with checkmarks, CTA button
- Include a "How Credits Work" explanation section (1 credit = 1 generation, credits reset monthly, unused credits don't roll over)
- Include an FAQ section at the bottom of the page

### FR-04: Dashboard (`/dashboard`)

The main hub for signed-in users, displaying account status and quick actions.

- Simulate signed-in state using mock user data (no real auth checks)
- Display a welcome header with the user's name and current plan badge
- Show 4 stat cards: Credits Remaining (75/100), Total Generations (42), This Month (8), Current Plan (Pro)
- Display a credit usage progress bar
- Prominent "Create New Plushie" CTA button linking to `/generate`
- Show a grid of the 4 most recent generated images from mock gallery data

### FR-05: Image Generation Page (`/generate`)

The core feature page where users create plushie versions of their photos.

- Drag-and-drop upload zone with file picker fallback (accepts PNG, JPG up to 10MB)
- Display preview of selected image in a "before" panel
- Card-based style selector with 5 options: Classic Plushie, Kawaii, Realistic Plush, Chibi, Vintage Teddy
- Settings panel: size dropdown (512x512, 1024x1024), quality toggle (Standard/HD)
- Credit cost indicator: "This will use 1 credit. You have 75 remaining."
- Generate button disabled until an image is selected
- Mock generation flow: clicking Generate shows a 2-second loading spinner, then displays a gradient placeholder as the result
- Result display: before/after comparison view, "Save to Gallery" button, "Download" button, "Generate Another" button

### FR-06: Gallery Page (`/gallery`)

A page displaying all of the user's previously generated plushie images.

- Page header showing "Your Gallery" with total count
- Filter bar: style filter dropdown (All, Classic, Kawaii, etc.), sort dropdown (Newest, Oldest)
- Responsive image grid: 2 columns on mobile, 3 on tablet, 4 on desktop
- Gallery cards showing: gradient placeholder, title, style badge, creation date, hover overlay with "View" button
- Detail modal (Dialog): full-size before/after comparison, title, style, date, credit cost, Download button, Delete button (all UI only)

### FR-07: Profile Page (`/profile`)

User account management page with subscription and credit information.

- Account overview section: avatar, name, email, plan badge, member since date
- Subscription section: current plan display, credits remaining with progress indicator, next renewal date
- Credit history section: mock table showing recent credit purchases and usage
- Account settings: display name and email (read-only display)
- Danger zone: delete account button (UI only, no functionality)

### FR-08: Documentation Pages (`/docs`)

Public-facing documentation to help users understand and use the application.

- **Docs Landing** (`/docs`): Overview page with links to all sub-sections
- **Docs Layout**: Sidebar navigation with content area for all docs sub-pages
- **Getting Started** (`/docs/getting-started`): Account creation walkthrough, first generation guide
- **Credits** (`/docs/credits`): How credits work, pricing tiers, credit costs per feature
- **FAQ** (`/docs/faq`): Common questions in accordion-style expandable sections
- **API** (`/docs/api`): Placeholder page for future API documentation

### FR-09: Legal Pages

Standard legal documents required for a SaaS application.

- **Privacy Policy** (`/privacy`): Standard privacy policy with proper headings and sections covering data collection, usage, storage, and user rights
- **Terms of Service** (`/terms`): Standard terms of service with proper headings and sections covering usage terms, limitations, and disclaimers

### FR-10: Navigation & Layout

Global navigation and layout components that appear on all pages.

- **Site Header:**
  - Plushify logo with soft pastel gradient text
  - Public nav links: Home, Pricing, Docs (always visible)
  - Signed-in nav links: Dashboard, Generate, Gallery
  - User profile dropdown showing credits badge and quick links
  - Dark/light mode toggle
  - Mobile responsive hamburger menu
- **Site Footer:**
  - Plushify branding with tagline
  - 4-column link layout: Product (Generate, Gallery, Pricing), Company (About placeholder, Blog placeholder), Legal (Privacy, Terms), Support (Docs, Contact placeholder)
  - Copyright: "2026 Plushify. All rights reserved."

### FR-11: Boilerplate Cleanup

All boilerplate-specific content must be removed from the codebase.

- Delete: `setup-checklist.tsx`, `starter-prompt-modal.tsx`, `github-stars.tsx`, `use-diagnostics.ts`
- Delete: `/api/diagnostics` route, `/chat` page directory, `/api/chat` route
- Delete: `docs/technical/` and `docs/business/` directories
- Remove all references to "Starter Kit", "Agentic Coding", "Boilerplate", "Leon van Zyl"

---

## Non-Functional Requirements

### NFR-01: Responsive Design
All pages must be fully responsive across mobile (< 640px), tablet (640px-1024px), and desktop (> 1024px) breakpoints using Tailwind CSS responsive utilities.

### NFR-02: Dark Mode Support
All pages and components must support both light and dark mode via the existing `next-themes` provider. Colors must be readable and visually appealing in both modes.

### NFR-03: Accessibility
Maintain existing accessibility patterns including skip-to-content links, proper ARIA labels, semantic HTML elements, keyboard navigation support, and sufficient color contrast ratios.

### NFR-04: Performance
Use Server Components by default for static pages (landing, pricing, legal, docs). Use Client Components only where client-side interactivity is required (generate, gallery, dashboard).

### NFR-05: SEO
The landing page must include optimized meta tags, Open Graph tags, Twitter card tags, and JSON-LD structured data specific to Plushify as a web application.

### NFR-06: Brand Consistency
The soft pastel color palette (pink, lavender, mint) must be applied consistently across all pages, components, and states in both light and dark modes.

### NFR-07: Code Quality
The codebase must pass `pnpm lint` and `pnpm typecheck` with zero errors, and must build successfully with `pnpm build:ci`.

### NFR-08: Mock Data Isolation
All mock/simulated data must be centralized in a single file (`src/lib/mock-data.ts`) to enable easy replacement with real data in the future.

---

## Acceptance Criteria

- [ ] All boilerplate-specific files and references are fully removed from the codebase
- [ ] Landing page renders with all sections: hero, showcase, features, how-it-works, testimonials, pricing preview, and CTA
- [ ] Pricing page displays three tiers with correct prices ($9/$19/$29) and credit amounts (30/100/200)
- [ ] Pro pricing tier is visually highlighted as "Most Popular"
- [ ] Auth pages (login, register, forgot-password, reset-password) display Plushify branding and pastel styling
- [ ] Dashboard shows mock user stats, credit progress bar, CTA button, and recent generations grid
- [ ] Generate page supports file selection with preview, style choice, settings, credit cost display, and simulated 2-second generation with result display
- [ ] Gallery page displays mock items in a responsive grid with style filtering, date sorting, and a detail modal
- [ ] Profile page shows account info, subscription details, credit history, and account settings
- [ ] Documentation pages render with sidebar navigation and content for all sub-pages
- [ ] Privacy Policy and Terms of Service pages render with properly formatted content
- [ ] Site header displays Plushify branding, full navigation, user dropdown with credits, and mobile menu
- [ ] Site footer displays 4-column link layout with Plushify branding
- [ ] Dark mode toggle works correctly and all pages are visually correct in both themes
- [ ] All pages are mobile responsive with no layout breakage
- [ ] Soft pastel color theme (pink, lavender, mint) is applied consistently throughout
- [ ] `pnpm lint && pnpm typecheck` passes with zero errors
- [ ] `pnpm build:ci` completes successfully
- [ ] No references to "Starter Kit", "Agentic Coding", or "Leon van Zyl" remain anywhere in the codebase
