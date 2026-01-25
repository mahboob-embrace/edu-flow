import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { authConfig } from "@/lib/auth.config";
import { encode, decode } from "next-auth/jwt";
import { v4 as uuid } from "uuid";

const adapter = PrismaAdapter(prisma);

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter,
  session: { strategy: "database" },
  jwt: { encode, decode },
  callbacks: {
    ...authConfig.callbacks,
    async session({ session, user }) {
      if (session.user && user) {
        session.user.id = user.id;
      }
      return session;
    },
    async signIn({ user, account }) {
      // For credentials provider, manually create session
      if (account?.provider === "credentials") {
        if (!user?.id) return false;
        
        const sessionToken = uuid();
        const sessionExpiry = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
        
        await adapter.createSession?.({
          sessionToken,
          userId: user.id,
          expires: sessionExpiry,
        });

        // Set the session token cookie
        const cookies = await import("next/headers").then((m) => m.cookies());
        cookies.set("authjs.session-token", sessionToken, {
          expires: sessionExpiry,
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
        });
      }
      return true;
    },
  },
});
