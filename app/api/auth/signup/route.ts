import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import * as v from "valibot";

const SignupSchema = v.object({
  name: v.pipe(v.string(), v.minLength(1, "Name is required")),
  email: v.pipe(v.string(), v.email("Invalid email address")),
  password: v.pipe(v.string(), v.minLength(8, "Password must be at least 8 characters")),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = v.safeParse(SignupSchema, body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.issues[0].message },
        { status: 400 }
      );
    }

    const { name, email, password } = result.output;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await hash(password, 12);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
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
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
