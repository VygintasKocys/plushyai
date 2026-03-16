# Replace Mock User Data with Real BetterAuth Session Data

## Overview

The application currently displays hardcoded dummy user data (`MOCK_USER` — "Jane Doe") across all authenticated pages and components. BetterAuth is already fully configured with email/password authentication, session management, and a Drizzle ORM adapter connected to PostgreSQL. The auth infrastructure (`useSession`, `requireAuth`, `getOptionalSession`) exists but is not wired into the UI. This feature replaces all mock user identity data with real session data from BetterAuth.

---

## Functional Requirements

### FR-1: Navigation Auth State

- The site header must display **Sign in** and **Sign up** buttons when no user session exists.
- The site header must display the authenticated user's avatar dropdown (via `UserProfile` component) when a session exists.
- Navigation links for authenticated features (Dashboard, Generate, Gallery) must only be visible to signed-in users.
- Public links (Home, Pricing, Docs) must always be visible regardless of auth state.

### FR-2: User Profile Dropdown (Header)

- The avatar dropdown must display the authenticated user's **name** and **email** from the BetterAuth session.
- The avatar must show the user's **profile image** if available, or fall back to the first letter of their name.
- The `mockMode` prop and all `MOCK_USER` references must be removed from the `UserProfile` component.
- The credits badge should be removed from the dropdown until a credits system is implemented in the database.

### FR-3: Dashboard Page

- The dashboard must be a protected route — unauthenticated users are redirected to `/`.
- The welcome message must display the authenticated user's first name (e.g., "Welcome back, {firstName}!").
- Stats cards (credits, plan, generations) should display placeholder/default values until billing and credits systems are built.
- Recent generations section may continue using mock gallery data until a generations table exists.

### FR-4: Profile Page

- The profile page must be a protected route — unauthenticated users are redirected to `/`.
- The profile must display the authenticated user's **name**, **email**, **profile image**, and **member since** date (derived from `createdAt`).
- The Account Settings section must show the user's real name and email.
- Subscription and credit history sections should remain as static placeholders until billing is implemented.
- Interactive elements (back button, delete account) must continue to function.

### FR-5: Generate Page

- The generate page must only be accessible to authenticated users.
- The `MOCK_USER` import must be removed.
- The credit display text should either show a static placeholder or be removed until credits exist in the database.

### FR-6: Mock Data Cleanup

- The `MOCK_USER` export must be removed from `src/lib/mock-data.ts` once no files import it.
- Static product data (`MOCK_GALLERY`, `PRICING_PLANS`, `TESTIMONIALS`, `PLUSHIE_STYLES`, `CREDIT_HISTORY`, `MONTHLY_GENERATIONS`) must be preserved — these are not user-specific data.

---

## Non-Functional Requirements

### NFR-1: Session Access Patterns

- **Server Components** must use `requireAuth()` or `getOptionalSession()` from `src/lib/session.ts` to access sessions via `auth.api.getSession()` with request headers.
- **Client Components** must use the `useSession()` hook from `src/lib/auth-client.ts`.
- No direct calls to BetterAuth APIs outside of the existing abstraction layer.

### NFR-2: Loading States

- Client components that depend on session data must show appropriate loading states (skeleton/pulse animations) while `isPending` is true.
- Pages must not flash unauthenticated UI before redirecting.

### NFR-3: Type Safety

- All session user data access must be properly typed — no `any` types or type assertions.
- The project must pass `pnpm run typecheck` with zero errors after all changes.

### NFR-4: Code Quality

- The project must pass `pnpm run lint` with zero errors after all changes.
- No unused imports or dead code related to mock data should remain.

### NFR-5: Performance

- Server components should be preferred over client components where possible to avoid unnecessary client-side JavaScript.
- Session checks in server components should not introduce additional round-trips beyond the single `getSession` call.

### NFR-6: Backwards Compatibility

- The landing page (`/`), pricing page, and other public pages must continue to work without authentication.
- Existing auth flows (login, register, forgot password, reset password) must not be affected.

---

## Acceptance Criteria

1. **Unauthenticated header:** Visiting any page without a session shows only public nav links and Sign in / Sign up buttons — no user avatar or authenticated links are visible.
2. **Authenticated header:** After signing in, the header shows all nav links (including Dashboard, Generate, Gallery) and the user's avatar dropdown with their real name and email.
3. **Dashboard redirect:** Visiting `/dashboard` without a session redirects to `/`.
4. **Dashboard content:** When authenticated, the dashboard greets the user by their real first name.
5. **Profile redirect:** Visiting `/profile` without a session redirects to `/`.
6. **Profile content:** When authenticated, the profile page displays the user's real name, email, and account creation date.
7. **Generate page auth:** The generate page is only accessible to authenticated users.
8. **No mock user references:** `MOCK_USER` is not imported in any component or page. The export is removed from `mock-data.ts`.
9. **Lint clean:** `pnpm run lint` passes with zero errors.
10. **Type clean:** `pnpm run typecheck` passes with zero errors.
11. **Public pages unaffected:** The landing page, pricing page, and auth pages continue to function correctly without a session.
