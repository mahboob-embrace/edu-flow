import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

// Edge-compatible auth that doesn't use Prisma adapter
// Only for middleware authorization checks
const { auth } = NextAuth(authConfig);

export const middleware = auth;

export const config = {
  matcher: [
    // Match all routes except static files and images
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
