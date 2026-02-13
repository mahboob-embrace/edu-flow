import * as v from "valibot";

/**
 * Password complexity validation schema
 * Requires at least 8 characters, one uppercase, one lowercase,
 * one number, and one special character.
 */
export const PasswordSchema = v.pipe(
  v.string(),
  v.minLength(8, "Password must be at least 8 characters"),
  v.regex(/[A-Z]/, "Password must contain at least one uppercase letter"),
  v.regex(/[a-z]/, "Password must contain at least one lowercase letter"),
  v.regex(/[0-9]/, "Password must contain at least one number"),
  v.regex(
    /[^A-Za-z0-9]/,
    "Password must contain at least one special character",
  ),
);

/**
 * Sign-in request body schema
 */
export const SigninSchema = v.object({
  email: v.pipe(
    v.string("Email is required"),
    v.trim(),
    v.email("Invalid email address"),
  ),
  password: v.pipe(
    v.string("Password is required"),
    v.minLength(1, "Password is required"),
  ),
});

/**
 * Sign-up request body schema
 */
export const SignupSchema = v.object({
  name: v.pipe(v.string(), v.minLength(1, "Name is required")),
  email: v.pipe(v.string("Email is required"), v.trim(), v.email("Invalid email address")), password: PasswordSchema,
});
