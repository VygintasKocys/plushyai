# Implementation Plan: Replace Mock User Data with Real BetterAuth Session Data

## Session Access Reference

Before starting, note the two patterns used throughout:

**Server Components** — use the existing helper in `src/lib/session.ts`:
```ts
import { requireAuth } from "@/lib/session";
const session = await requireAuth(); // redirects to "/" if not authed
// session.user.name, session.user.email, session.user.image, session.user.createdAt
```

**Client Components** — use the hook from `src/lib/auth-client.ts`:
```ts
import { useSession } from "@/lib/auth-client";
const { data: session, isPending } = useSession();
// session?.user.name, session?.user.email, session?.user.image
```

---

## Phase 1: Site Header — Conditional Navigation

**Goal:** Show/hide nav links and user controls based on authentication state.

**File:** `src/components/site-header.tsx`

- [x] Import `useSession` from `@/lib/auth-client`
- [x] Call `useSession()` to get `session` and `isPending` state
- [x] Replace the hardcoded `allLinks` variable: show `publicLinks` always, append `signedInLinks` only when `session` exists
- [x] Remove the comment `// For now, show signed-in links (mock mode)`
- [x] Ensure the mobile menu (Sheet) also conditionally renders the signed-in links
- [x] Verify that the `UserProfile` component (already rendered in header) handles its own auth state — no changes needed to how it's called here

---

## Phase 2: UserProfile Component — Remove Mock Mode

**Goal:** Remove all mock data dependencies; rely solely on BetterAuth session.

**File:** `src/components/auth/user-profile.tsx`

- [x] Remove the `MOCK_USER` import from `@/lib/mock-data`
- [x] Remove the `UserProfileProps` interface and `mockMode` prop
- [x] Remove the `useMock` variable and ternary logic — use `session?.user` directly
- [x] Remove the hardcoded `credits` variable (`const credits = MOCK_USER.credits`)
- [x] Remove the `CreditBadge` from the dropdown menu (credits don't exist in DB yet)
- [x] Remove the `CreditBadge` import if it becomes unused
- [x] Verify the sign-in/sign-up buttons still render when no session exists
- [x] Verify the loading skeleton still renders while `isPending` is true
- [x] Verify sign-out flow still works (already uses real `signOut()`)

---

## Phase 3: Dashboard Page — Real Session Data

**Goal:** Display the authenticated user's real name and enforce route protection.

**File:** `src/app/dashboard/page.tsx`

- [x] Import `requireAuth` from `@/lib/session`
- [x] Make `DashboardPage` an `async` function and call `const session = await requireAuth()` at the top
- [x] Replace `MOCK_USER.name` with `session.user.name` in the welcome heading
- [x] Update the plan badge to show a static default (e.g., "Free") instead of `MOCK_USER.plan`
- [x] Update stats cards: replace `MOCK_USER.credits`, `MOCK_USER.totalGenerations` with placeholder values (e.g., `0/0` credits, `0` generations) or static defaults
- [x] Remove the `MOCK_USER` import (keep `MOCK_GALLERY` and `MONTHLY_GENERATIONS` imports if still used for the gallery section)
- [x] Keep the recent generations section using `MOCK_GALLERY` (this is product demo data, not user data)

---

## Phase 4: Profile Page — Real Session Data with Server/Client Split

**Goal:** Display real user profile info from BetterAuth session, maintain interactivity.

**Files:** `src/app/profile/page.tsx`

- [x] Remove `"use client"` directive — convert to a server component
- [x] Import `requireAuth` from `@/lib/session`
- [x] Call `const session = await requireAuth()` to get session data
- [x] Extract a `ProfileContent` client component (can be in the same file or a new file at `src/components/profile-content.tsx`) for interactive elements (back button, delete account button with toast)
- [x] Pass user data as props to `ProfileContent`: `name`, `email`, `image`, `createdAt`
- [x] In the Account Overview card: replace `MOCK_USER.name` with `user.name`, `MOCK_USER.email` with `user.email`
- [x] Replace the avatar fallback: use `user.name[0]` instead of `MOCK_USER.name[0]`
- [x] Add `AvatarImage` using `user.image` if available
- [x] Replace "Member since" date: derive from `user.createdAt` instead of `MOCK_USER.memberSince`
- [x] Replace Account Settings display name and email with real user data
- [x] Update the plan badge to show a static default instead of `MOCK_USER.plan`
- [x] Keep subscription card and credit history as static placeholder content
- [x] Remove the `MOCK_USER` and `CREDIT_HISTORY` imports

---

## Phase 5: Generate Page — Auth Guard and Mock Removal

**Goal:** Remove mock user dependency and protect the route.

**File:** `src/app/generate/page.tsx`

- [x] Remove the `MOCK_USER` import from `@/lib/mock-data`
- [x] Import `useSession` from `@/lib/auth-client` and `useRouter` from `next/navigation`
- [x] Add session check: if not authenticated and not pending, redirect to `/login`
- [x] Update the credit display text — either remove the specific count or show a generic message (e.g., "This will use 1 credit.")
- [x] Add `/generate` to the `protectedRoutes` array in `src/lib/session.ts`
- [x] Show a loading state while session is pending

---

## Phase 6: Mock Data Cleanup and Final Validation

**Goal:** Remove unused mock data exports and verify everything works.

**Files:** `src/lib/mock-data.ts`, `src/lib/session.ts`

- [x] Verify no file imports `MOCK_USER` — search the codebase
- [x] Remove the `MOCK_USER` export from `src/lib/mock-data.ts`
- [x] Verify `CREDIT_HISTORY` is still needed — if the profile page no longer uses it, remove it too
- [x] Confirm `protectedRoutes` in `src/lib/session.ts` includes `/dashboard`, `/profile`, and `/generate`
- [x] Run `pnpm run lint` — fix any errors
- [x] Run `pnpm run typecheck` — fix any type errors
- [ ] Manual verification: visit all affected pages in both authenticated and unauthenticated states (see acceptance criteria in requirements.md)
