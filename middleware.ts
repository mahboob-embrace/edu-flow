import { NextResponse, type NextRequest } from "next/server";
import { protectedRoutes, authRoutes, apiAuthPrefix } from "@/config/routes";

/**
 * Middleware for route protection
 * Checks for session cookie to determine if user is authenticated
 * Note: This is a simple cookie presence check - actual session validation
 * happens in the server components via the auth() function
 */
export function middleware(request: NextRequest) {
  const { nextUrl } = request;

  // Check for NextAuth session cookie
  // NextAuth v5 uses "authjs.session-token" for database sessions
  const sessionToken = request.cookies.get("authjs.session-token")?.value;
  const isLoggedIn = !!sessionToken;

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isProtectedRoute = protectedRoutes.some((route) =>
    nextUrl.pathname.startsWith(route),
  );

  const isAuthRoute = authRoutes.some((route) =>
    nextUrl.pathname.startsWith(route),
  );

  // Allow API auth routes to pass through
  if (isApiAuthRoute) {
    return NextResponse.next();
  }

  // Redirect logged-in users away from auth pages
  if (isAuthRoute && isLoggedIn) {
    return NextResponse.redirect(new URL("/dashboard", nextUrl));
  }

  // Protect routes that require authentication
  if (isProtectedRoute && !isLoggedIn) {
    const callbackUrl = encodeURIComponent(nextUrl.pathname + nextUrl.search);
    return NextResponse.redirect(
      new URL(`/sign-in?callbackUrl=${callbackUrl}`, nextUrl),
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
