# Polar Payment Integration — Implementation Plan

## Overview

This plan is organized into 5 phases. Each phase builds on the previous one and can be verified independently before moving to the next.

---

## Phase 1: Foundation — Dependencies & Configuration

Set up packages, environment variables, and Polar SDK configuration without changing any UI or behavior.

### Tasks

- [x] Install dependencies: `pnpm add @polar-sh/better-auth @polar-sh/sdk`
- [x] Add `POLAR_ENVIRONMENT=sandbox` to `env.example` (lines 28-31 already have `POLAR_ACCESS_TOKEN` and `POLAR_WEBHOOK_SECRET`)
- [x] Update `src/lib/mock-data.ts`:
  - [x] Add `polarProductId: string` field to each entry in `PRICING_PLANS` with placeholder values (e.g., `"REPLACE_WITH_POLAR_PRODUCT_ID_BASIC"`)
  - [x] Add `PLAN_CREDITS` export: `Record<string, number>` mapping plan slug to credits (`{ basic: 30, pro: 100, elite: 200 }`)
- [x] Configure Polar plugin on the server in `src/lib/auth.ts`:
  - [x] Import `polar`, `checkout`, `portal`, `webhooks` from `@polar-sh/better-auth`
  - [x] Import `Polar` from `@polar-sh/sdk`
  - [x] Import `db` from `./db`, `eq` from `drizzle-orm`, `PRICING_PLANS` from `./mock-data`, `user` from `./schema`
  - [x] Create `Polar` SDK client instance using `POLAR_ACCESS_TOKEN` and `POLAR_ENVIRONMENT` env vars
  - [x] Add `polar()` plugin to the `plugins` array alongside existing `admin()` with:
    - `createCustomerOnSignUp: true`
    - `checkout()` sub-plugin mapping `PRICING_PLANS` to products with slugs, `successUrl: "/success?checkout_id={CHECKOUT_ID}"`, `authenticatedUsersOnly: true`
    - `portal()` sub-plugin
    - `webhooks()` sub-plugin with `POLAR_WEBHOOK_SECRET` (webhook handlers added in Phase 3)
- [x] Configure Polar plugin on the client in `src/lib/auth-client.ts`:
  - [x] Import `polarClient` from `@polar-sh/better-auth/client`
  - [x] Add `polarClient()` to the `plugins` array alongside existing `adminClient()`
- [x] Run `pnpm run db:generate && pnpm run db:migrate` to apply any schema changes from the plugin
- [x] Run `pnpm run lint && pnpm run typecheck` to verify no errors

### Verification
- App builds and starts without errors.
- No existing functionality is broken.
- BetterAuth admin plugin still works.

---

## Phase 2: Checkout Flow — Pricing Page & Success Page

Wire up the pricing page buttons to initiate real Polar checkout sessions and create the post-checkout success page.

### Tasks

- [x] Create `src/components/pricing-cards.tsx` (client component):
  - [x] Add `"use client"` directive
  - [x] Import `authClient`, `useSession` from `@/lib/auth-client`
  - [x] Import `useRouter` from `next/navigation`
  - [x] Import UI components: `Badge`, `Button`, `Card`, `CardContent`, `CardDescription`, `CardFooter`, `CardHeader`, `CardTitle` from shadcn/ui
  - [x] Import `PRICING_PLANS` from `@/lib/mock-data`, `cn` from `@/lib/utils`, `Check` from `lucide-react`, `toast` from `sonner`
  - [x] Create `handleCheckout(planSlug: string)` function:
    - If no session → `router.push("/register")`
    - If session → `await authClient.checkout({ slug: planSlug })`
    - Wrap in try/catch with toast error on failure
  - [x] Add loading state (e.g., `useState` for `checkoutLoading`) to disable button during redirect
  - [x] Render the pricing cards grid (move card markup from `pricing/page.tsx` lines 72-117)
  - [x] Replace `<Link href="/register">` with `<Button onClick={() => handleCheckout(plan.id)}>`
- [x] Update `src/app/pricing/page.tsx`:
  - [x] Remove the inline pricing cards grid (lines 72-117)
  - [x] Import and render `<PricingCards />` in its place
  - [x] Keep the Server Component wrapper with metadata, "How Credits Work" section, and FAQ
- [x] Create `src/app/success/page.tsx`:
  - [x] Server Component with `export const metadata` for SEO
  - [x] Call `requireAuth()` from `@/lib/session` to protect the route
  - [x] Render a success card with `CheckCircle` icon from `lucide-react`
  - [x] Include CTA buttons: "Start Creating" → `/generate`, "Go to Dashboard" → `/dashboard`
- [x] Run `pnpm run lint && pnpm run typecheck`

### Verification
- Pricing page renders correctly with interactive buttons.
- Clicking a plan while unauthenticated redirects to `/register`.
- Clicking a plan while authenticated initiates Polar checkout (requires Polar product IDs to be configured).
- `/success` page renders and requires authentication.

---

## Phase 3: Webhook Handlers — Credit Allocation

Implement the webhook handlers that respond to Polar payment events and allocate/manage credits.

### Tasks

- [x] Update webhook handlers in `src/lib/auth.ts` within the `webhooks()` configuration:
  - [x] Implement `onOrderPaid` handler:
    - Extract `externalId` from `payload.data.customer.externalId`
    - Return early if no `externalId`
    - Extract `productId` from `payload.data.productId`
    - Find matching plan in `PRICING_PLANS` by `polarProductId`
    - If plan found, SET user credits to `plan.credits` using `db.update(user).set({ credits: plan.credits }).where(eq(user.id, externalId))`
  - [x] Implement `onSubscriptionCanceled` handler:
    - No credit removal — user retains credits until period ends
    - Log the event for observability (optional)
  - [x] Implement `onSubscriptionRevoked` handler:
    - Extract `externalId` from payload
    - Optionally handle (e.g., log, or leave credits as-is for graceful degradation)
- [x] Run `pnpm run lint && pnpm run typecheck`

### Verification
- Webhook endpoint is accessible at `/api/auth/polar/webhooks` (handled by BetterAuth catch-all route).
- Manually test with Polar sandbox: complete a checkout → verify user credits are updated in the database.
- For local dev, use ngrok or Polar CLI for webhook forwarding.

---

## Phase 4: Plan Badge & Subscription State

Create a reusable component that fetches and displays the user's active subscription plan, to be used across multiple pages.

### Tasks

- [x] Create `src/components/plan-badge.tsx` (client component):
  - [x] Add `"use client"` directive
  - [x] Import `authClient` from `@/lib/auth-client`
  - [x] Import `Badge` from `@/components/ui/badge`, `Crown` from `lucide-react`
  - [x] Import `PRICING_PLANS` from `@/lib/mock-data`
  - [x] Use `useEffect` + `useState` to fetch `authClient.customer.state()` on mount
  - [x] Extract active subscription from customer state
  - [x] Match subscription's product ID against `PRICING_PLANS` to determine plan name
  - [x] Render `<Badge>` with plan name (Basic/Pro/Elite) or "Free" if no active subscription
  - [x] Handle loading state (skeleton or placeholder)
  - [x] Handle error state gracefully (fall back to "Free")
  - [x] Export the component and also export a `usePlanState` hook for reuse (returns `{ planName, planCredits, isLoading, subscription }`)
- [x] Run `pnpm run lint && pnpm run typecheck`

### Verification
- Component renders "Free" when user has no subscription.
- Component renders the correct plan name when user has an active subscription.
- Loading state is handled without layout shift.

---

## Phase 5: UI Updates — Profile & Dashboard

Update the profile and dashboard pages to display real subscription and credit data instead of hardcoded mock values.

### Tasks

- [x] Update `src/components/profile-content.tsx`:
  - [x] Import `authClient` from `@/lib/auth-client`
  - [x] Import `PlanBadge` and `usePlanState` from `@/components/plan-badge`
  - [x] Import `PRICING_PLANS` from `@/lib/mock-data`
  - [x] Replace hardcoded `<Badge variant="secondary"><Crown /> Free</Badge>` (line 71-74) with `<PlanBadge />`
  - [x] In the Subscription card section (lines 96-101):
    - [x] Use `usePlanState()` hook to get `planName`, `planCredits`, and `subscription`
    - [x] Replace "Free Plan" with `planName` + " Plan"
    - [x] Replace "No active subscription" with actual status (e.g., "Active", "Canceled — access until period end")
  - [x] Update Progress bar (line 108): change denominator from hardcoded `3` to `planCredits` (default to 3 for free users)
  - [x] Add "Manage Subscription" button below the subscription info:
    - [x] Only visible when user has an active subscription
    - [x] `onClick` calls `authClient.customer.portal()`
  - [x] Add "Upgrade Plan" link (→ `/pricing`) visible only for free-tier users
- [x] Update `src/app/dashboard/page.tsx`:
  - [x] Replace hardcoded mock stats with real credit data from the database query
  - [x] Import and use `<PlanBadge />` component instead of hardcoded "Free Plan" badge
  - [x] Show actual credit usage: `credits / planCredits` in the stats display
- [x] Run `pnpm run lint && pnpm run typecheck`

### Verification
- Profile page shows correct plan badge matching the user's active subscription.
- Profile page shows real credit balance with correct progress bar.
- "Manage Subscription" button appears for subscribed users and opens Polar portal.
- "Upgrade Plan" link appears for free users and navigates to `/pricing`.
- Dashboard shows real credit data and plan badge.
- Free users (no subscription) see "Free" plan with their current credits out of 3.
- Subscribed users see their plan name with credits out of plan total.

---

## Files Summary

| Phase | File | Action |
|-------|------|--------|
| 1 | `env.example` | Modify |
| 1 | `src/lib/mock-data.ts` | Modify |
| 1 | `src/lib/auth.ts` | Modify |
| 1 | `src/lib/auth-client.ts` | Modify |
| 2 | `src/components/pricing-cards.tsx` | **Create** |
| 2 | `src/app/pricing/page.tsx` | Modify |
| 2 | `src/app/success/page.tsx` | **Create** |
| 3 | `src/lib/auth.ts` | Modify (add webhook logic) |
| 4 | `src/components/plan-badge.tsx` | **Create** |
| 5 | `src/components/profile-content.tsx` | Modify |
| 5 | `src/app/dashboard/page.tsx` | Modify |

## Existing Code to Reuse

- `requireAuth()` from `src/lib/session.ts` — protect the success page
- `useSession` from `src/lib/auth-client` — check auth state in pricing cards
- `PRICING_PLANS` from `src/lib/mock-data.ts` — centralized plan data
- `cn()` from `src/lib/utils` — class name merging
- `db` from `src/lib/db` + `user` from `src/lib/schema` — credit updates in webhooks
- shadcn/ui components: Card, Badge, Button, Progress, Separator
