# Polar Payment Integration — Requirements

## Overview

Integrate Polar as the payment gateway for Plushify using BetterAuth's official Polar plugin (`@polar-sh/better-auth`). The three existing pricing tiers (Basic, Pro, Elite) currently displayed as static UI mockups on the pricing page must become fully functional subscription plans with real checkout flows, automated credit allocation, and subscription lifecycle management.

---

## Initial Requirements

1. **Payment Gateway**: Use Polar as the sole payment provider, integrated through BetterAuth's Polar plugin.
2. **Three Subscription Tiers**: Connect the existing pricing plans to Polar products:
   - **Basic** — $9/month, 30 credits
   - **Pro** — $19/month, 100 credits
   - **Elite** — $29/month, 200 credits
3. **Checkout Flow**: Authenticated users can purchase a subscription directly from the pricing page via Polar's hosted checkout.
4. **Credit Allocation**: Credits are automatically allocated when a subscription is purchased or renewed.
5. **Subscription Management**: Users can view and manage their subscription (cancel, upgrade) through Polar's customer portal.
6. **Plan Visibility**: The user's active plan and credit balance are displayed accurately across the app (profile, dashboard).

---

## Functional Requirements

### FR-1: Polar SDK & Plugin Configuration
- The Polar SDK client must be initialized with an access token and environment setting (sandbox/production).
- The BetterAuth Polar plugin must be added to the server-side auth configuration with checkout, portal, and webhooks sub-plugins.
- The Polar client plugin must be added to the client-side auth configuration.

### FR-2: Automatic Customer Creation
- When a new user registers, a corresponding Polar customer record must be created automatically.
- The Polar customer's `externalId` must map to the BetterAuth user ID (no additional mapping table required).

### FR-3: Checkout Integration
- Each pricing plan must be mapped to a Polar product ID via a configurable slug (basic, pro, elite).
- Clicking a plan's CTA button on the pricing page must initiate a Polar checkout session.
- Only authenticated users may initiate checkout (`authenticatedUsersOnly: true`).
- Unauthenticated users clicking a plan CTA must be redirected to the registration page.
- On successful checkout, the user must be redirected to a success page (`/success`).

### FR-4: Webhook-Based Credit Allocation
- An `onOrderPaid` webhook handler must allocate credits when a subscription is purchased or renewed.
- Credits must be SET to the plan's credit amount (not added), implementing the "no rollover" policy.
- The webhook must identify the user via the Polar customer's `externalId` and match the product ID to the correct plan.

### FR-5: Subscription Lifecycle Handling
- `onSubscriptionCanceled`: No immediate credit removal — user retains credits until the billing period ends.
- `onSubscriptionRevoked`: Subscription fully ended — handle as appropriate (user falls back to free tier).

### FR-6: Customer Portal
- Users must be able to access the Polar customer portal from their profile page to manage subscriptions, view orders, and handle billing.

### FR-7: Plan Display
- A reusable plan badge component must display the user's current plan (Free, Basic, Pro, or Elite).
- The plan badge must fetch the user's subscription state via `authClient.customer.state()`.
- The plan badge must be displayed on the profile page and dashboard.

### FR-8: Profile Page Updates
- Replace hardcoded "Free Plan" with the actual active plan name.
- Display real subscription status (active, canceled, none).
- Show credit progress bar with the correct denominator based on the active plan's total credits.
- Provide a "Manage Subscription" button that opens the Polar customer portal.
- Provide an "Upgrade Plan" link for free-tier users.

### FR-9: Dashboard Updates
- Replace hardcoded mock stats with real credit data from the database.
- Display the user's active plan via the plan badge component.
- Show actual `credits used / total plan credits` in stats cards.

### FR-10: Checkout Success Page
- A dedicated `/success` page must confirm the payment was successful.
- The page must be protected (require authentication).
- The page must provide navigation to the generate page and dashboard.

---

## Non-Functional Requirements

### NFR-1: Security
- Polar webhook payloads must be verified using the `POLAR_WEBHOOK_SECRET` for signature validation.
- Checkout sessions must only be available to authenticated users.
- Environment secrets (`POLAR_ACCESS_TOKEN`, `POLAR_WEBHOOK_SECRET`) must never be exposed to the client.

### NFR-2: Reliability
- Credit allocation via webhooks must be idempotent — receiving the same `onOrderPaid` event multiple times must not grant duplicate credits (SET, not ADD).
- Webhook failures must not leave the system in an inconsistent state.

### NFR-3: Configuration
- Polar product IDs must be configurable (not hardcoded) so they can differ between sandbox and production environments.
- The Polar environment (sandbox/production) must be controlled via an environment variable.

### NFR-4: User Experience
- Checkout redirect must include a loading state on the button to prevent double-clicks.
- Plan and credit information must be fetched client-side to avoid blocking server rendering.
- The success page must display immediately without waiting for webhook processing.

### NFR-5: Maintainability
- No additional database tables should be introduced — leverage Polar's `externalId` mapping.
- Reuse existing shadcn/ui components (Card, Badge, Button, Progress) and utilities (`cn`, `requireAuth`).
- Pricing plan data must remain centralized in `src/lib/mock-data.ts`.

### NFR-6: Compatibility
- The integration must work with the existing BetterAuth admin plugin without conflicts.
- The existing credit deduction logic in `src/app/generate/actions.ts` must continue to work unchanged.
- The existing Inngest-based credit refund on generation failure must continue to work unchanged.

---

## Acceptance Criteria

### AC-1: Package Installation
- [ ] `@polar-sh/better-auth` and `@polar-sh/sdk` are installed as dependencies.
- [ ] `pnpm run lint && pnpm run typecheck` pass without errors after all changes.

### AC-2: Environment Configuration
- [ ] `env.example` includes `POLAR_ACCESS_TOKEN`, `POLAR_WEBHOOK_SECRET`, and `POLAR_ENVIRONMENT`.
- [ ] The app starts without errors when Polar env vars are not set (graceful degradation or clear error message).

### AC-3: Customer Creation
- [ ] Registering a new user creates a corresponding Polar customer with matching `externalId`.

### AC-4: Checkout Flow
- [ ] Clicking a plan button on `/pricing` while authenticated initiates a Polar checkout redirect.
- [ ] Clicking a plan button on `/pricing` while unauthenticated redirects to `/register`.
- [ ] Completing a checkout in Polar sandbox redirects the user to `/success`.

### AC-5: Credit Allocation
- [ ] Upon successful payment (webhook `onOrderPaid`), the user's credits are set to the plan's credit amount.
- [ ] On subscription renewal, credits are reset to the plan amount (no rollover).

### AC-6: Subscription Management
- [ ] Clicking "Manage Subscription" on the profile page opens the Polar customer portal.
- [ ] Canceling a subscription in the portal does not immediately remove credits.

### AC-7: Plan Display
- [ ] The profile page shows the correct active plan name and subscription status.
- [ ] The dashboard shows the correct plan badge and real credit balance.
- [ ] The credit progress bar uses the active plan's total credits as the denominator.
- [ ] Free-tier users see "Free" as their plan with an option to upgrade.

### AC-8: Success Page
- [ ] `/success` is a protected route that requires authentication.
- [ ] The page displays a confirmation message and navigation buttons.

### AC-9: Backward Compatibility
- [ ] Existing image generation and credit deduction continue to work unchanged.
- [ ] Inngest credit refund on failed generation continues to work unchanged.
- [ ] Existing users with free credits can still generate without a subscription.
