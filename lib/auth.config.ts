import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
import Facebook from "next-auth/providers/facebook";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { protectedRoutes } from "@/config/routes";

// Maximum failed login attempts before account lockout
const MAX_FAILED_ATTEMPTS = 5;
// Lockout duration in milliseconds (15 minutes)
const LOCKOUT_DURATION_MS = 15 * 60 * 1000;

export const authConfig: NextAuthConfig = {
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
    Facebook({
      clientId: process.env.AUTH_FACEBOOK_ID,
      clientSecret: process.env.AUTH_FACEBOOK_SECRET,
    }),
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const { prisma } = await import("@/lib/prisma");

        // Case-insensitive email lookup
        const normalizedEmail = (credentials.email as string)
          .toLowerCase()
          .trim();

        const user = await prisma.user.findFirst({
          where: {
            email: { equals: normalizedEmail, mode: "insensitive" },
          },
        });

        if (!user || !user.password) {
          return null;
        }

        // Check if user is active
        if (!user.isActive) {
          return null;
        }

        // Check if user is locked out
        if (user.lockedUntil && new Date() < user.lockedUntil) {
          return null;
        }

        const isPasswordValid = await compare(
          credentials.password as string,
          user.password,
        );

        if (!isPasswordValid) {
          // Increment failed login attempts
          const newFailedAttempts = user.failedLoginAttempts + 1;
          const shouldLock = newFailedAttempts >= MAX_FAILED_ATTEMPTS;

          await prisma.user.update({
            where: { id: user.id },
            data: {
              failedLoginAttempts: newFailedAttempts,
              lockedUntil: shouldLock
                ? new Date(Date.now() + LOCKOUT_DURATION_MS)
                : null,
            },
          });

          return null;
        }

        // Reset failed login attempts on successful login
        if (user.failedLoginAttempts > 0) {
          await prisma.user.update({
            where: { id: user.id },
            data: {
              failedLoginAttempts: 0,
              lockedUntil: null,
            },
          });
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        };
      },
    }),
  ],
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
