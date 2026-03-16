import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

/**
 * Protected routes that require authentication.
 * These are also configured in src/proxy.ts for optimistic redirects.
 */
export const protectedRoutes = ["/dashboard", "/profile", "/generate", "/admin"];

/**
 * Checks if the current request is authenticated.
 * Should be called in Server Components for protected routes.
 *
 * @returns The session object if authenticated
 * @throws Redirects to home page if not authenticated
 */
export async function requireAuth() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect("/login");
  }

  return session;
}

/**
 * Gets the current session without requiring authentication.
 * Returns null if not authenticated.
 *
 * @returns The session object or null
 */
export async function getOptionalSession() {
  return await auth.api.getSession({ headers: await headers() });
}

/**
 * Checks if a given path is a protected route.
 *
 * @param path - The path to check
 * @returns True if the path requires authentication
 */
export function isProtectedRoute(path: string): boolean {
  return protectedRoutes.some(
    (route) => path === route || path.startsWith(`${route}/`)
  );
}

/**
 * Checks if the current request is authenticated as an admin.
 * Redirects to dashboard if user is not an admin.
 *
 * @returns The session object if authenticated as admin
 * @throws Redirects to dashboard if not an admin
 */
export async function requireAdmin() {
  const session = await requireAuth();

  if (session.user.role?.trim() !== "admin") {
    redirect("/dashboard");
  }

  return session;
}
