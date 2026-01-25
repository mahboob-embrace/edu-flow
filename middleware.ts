import { authMiddleware } from "@/lib/auth.edge";
import { NextResponse } from "next/server";
import {
  protectedRoutes,
  authRoutes,
  apiAuthPrefix,
  publicRoutes,
} from "@/config/routes";

export default authMiddleware((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isProtectedRoute = protectedRoutes.some((route) =>
    nextUrl.pathname.startsWith(route),
  );
  const isAuthRoute = authRoutes.some((route) =>
    nextUrl.pathname.startsWith(route),
  );
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);

  // Allow API auth routes to pass through
  if (isApiAuthRoute) {
    return NextResponse.next();
  }

  // Redirect logged-in users away from auth pages
  if (isAuthRoute) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL("/dashboard", nextUrl));
    }
    return NextResponse.next();
  }

  // Protect routes that require authentication
  if (isProtectedRoute && !isLoggedIn) {
    const callbackUrl = encodeURIComponent(nextUrl.pathname + nextUrl.search);
    return NextResponse.redirect(
      new URL(`/sign-in?callbackUrl=${callbackUrl}`, nextUrl),
    );
  }

  return NextResponse.next();
});

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
