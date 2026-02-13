import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import * as v from "valibot";
import { SignupSchema } from "@/lib/validations/auth";

// Re-export for backwards compatibility
export { PasswordSchema, SignupSchema } from "@/lib/validations/auth";

export async function POST(request: Request) {
  try {
    // Rate limiting
    const clientIp = getClientIp(request);
    if (!clientIp) {
      console.error("Failed to get client IP");
      return NextResponse.json(
        { error: "Cannot process request." },
        { status: 400 },
      );
    }

    const rateLimitResult = rateLimit(`signup:${clientIp}`, {
      maxRequests: 3,
      windowMs: 60 * 1000, // 3 requests per minute for signup
    });

    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: "Too many signup attempts. Please try again later." },
        {
          status: 429,
          headers: {
            "Retry-After": String(
              Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000),
            ),
          },
        },
      );
    }

    const body = await request.json();
    const { success, output, issues } = v.safeParse(SignupSchema, body);

    if (!success) {
      return NextResponse.json({ error: issues[0].message }, { status: 400 });
    }

    const { name, email, password } = output;

    // Normalize email to lowercase
    const normalizedEmail = email.toLowerCase().trim();

    // Case-insensitive email check
    const existingUser = await prisma.user.findFirst({
      where: {
        email: { equals: normalizedEmail, mode: "insensitive" },
      },
    });

    if (existingUser) {
      // Generic error to prevent user enumeration
      return NextResponse.json(
        {
          error:
            "Unable to create account. Please try again or use a different email.",
        },
        { status: 400 },
      );
    }

    const hashedPassword = await hash(password, 12);

    const user = await prisma.user.create({
      data: {
        name,
        email: normalizedEmail,
        password: hashedPassword,
        isActive: true,
        failedLoginAttempts: 0,
      },
    });

    return NextResponse.json(
      {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Signup error:", error);

    // Handle specific Prisma database connection errors
    if (error instanceof Error && error.message.includes("P1000")) {
      return NextResponse.json(
        { error: "Database connection failed. Please try again later." },
        { status: 500 },
      );
    }

    // Handle Prisma unique constraint errors (belt and suspenders with the check above)
    if (error instanceof Error && error.message.includes("P2002")) {
      return NextResponse.json(
        {
          error:
            "Unable to create account. Please try again or use a different email.",
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
