import type { NextAuthConfig } from "next-auth";
import type { Role } from "@/types/roles";

/**
 * Edge-compatible auth configuration
 * Does NOT include Prisma adapter or credentials provider (bcrypt)
 * Used only for middleware authorization checks
 */
export const authConfig: NextAuthConfig = {
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/sign-in",
    error: "/sign-in",
  },
  providers: [], // Providers are added in auth.ts (server-side only)
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role: Role }).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as Role;
      }
      return session;
    },
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith("/dashboard");
      const isOnAuthPage =
        nextUrl.pathname === "/sign-in" || nextUrl.pathname === "/sign-up";

      if (isOnDashboard) {
        return isLoggedIn; // Will redirect to sign-in if not logged in
      }

      if (isLoggedIn && isOnAuthPage) {
        return Response.redirect(new URL("/dashboard", nextUrl));
      }

      return true;
    },
  },
};
