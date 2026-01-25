/**
 * Centralized route configuration
 * Used by middleware and auth config for consistent route protection
 */

/** Routes that require authentication */
export const protectedRoutes = [
  "/dashboard",
  "/profile",
  "/settings",
  "/people",
];

/** Authentication routes (login, signup, etc.) */
export const authRoutes = ["/sign-in", "/sign-up", "/error", "/signout"];

/** Public routes accessible to everyone */
export const publicRoutes = ["/"];

/** API auth route prefix (NextAuth handlers) */
export const apiAuthPrefix = "/api/auth";

/** Default redirect after login */
export const DEFAULT_LOGIN_REDIRECT = "/dashboard";
