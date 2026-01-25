/**
 * Edge-compatible auth configuration
 * This file is used by middleware.ts which runs in the edge runtime
 * It should NOT import prisma or any Node.js-only modules
 */
import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config.edge";

export const { auth: authMiddleware } = NextAuth(authConfig);
