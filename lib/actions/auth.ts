"use server";

import { cookies } from "next/headers";
import { compare } from "bcryptjs";
import { v4 as uuid } from "uuid";
import { prisma } from "@/lib/prisma";

export async function signInWithCredentials(email: string, password: string) {
  try {
    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !user.password) {
      return { error: "Invalid email or password" };
    }

    // Verify password
    const isPasswordValid = await compare(password, user.password);

    if (!isPasswordValid) {
      return { error: "Invalid email or password" };
    }

    // Create session
    const sessionToken = uuid();
    const sessionExpiry = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

    await prisma.session.create({
      data: {
        sessionToken,
        userId: user.id,
        expires: sessionExpiry,
      },
    });

    // Set session cookie
    const cookieStore = await cookies();
    cookieStore.set("authjs.session-token", sessionToken, {
      expires: sessionExpiry,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    return { success: true, user: { id: user.id, email: user.email, name: user.name } };
  } catch (error) {
    console.error("Sign in error:", error);
    return { error: "Something went wrong" };
  }
}
