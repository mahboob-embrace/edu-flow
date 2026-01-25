/**
 * Edge-compatible auth configuration
 * This file is used by middleware which runs in the edge runtime
 * It should NOT import prisma or any Node.js-only modules
 */
import type { NextAuthConfig } from "next-auth";
import { protectedRoutes } from "@/config/routes";

/**
 * Edge-compatible auth config
 * Only includes configuration that can run in edge runtime
 * No database calls or Node.js crypto modules
 */
export const authConfig: NextAuthConfig = {
  providers: [], // Providers are configured in the main auth.ts
  pages: {
    signIn: "/sign-in",
    signOut: "/sign-out",
    error: "/error",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isProtectedRoute = protectedRoutes.some((route) =>
        nextUrl.pathname.startsWith(route),
      );

      if (isProtectedRoute && !isLoggedIn) {
        return false;
      }

      return true;
    },
  },
};
