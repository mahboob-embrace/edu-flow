"use client";

import { signUpAction, type AuthActionResult } from "@/app/actions/auth";
import { signInWithGoogle, signInWithFacebook } from "@/app/actions/oauth";
import Link from "next/link";
import { useActionState, useState } from "react";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { User, Mail, Lock, Eye, EyeOff, CheckCircle } from "lucide-react";

const initialState: AuthActionResult = {};

export default function SignUpPage() {
  const [state, formAction, isPending] = useActionState(
    signUpAction,
    initialState
  );
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <AuthLayout
      title="Let's Get Started"
      subtitle="Join EduFlow today and start learning"
      isSignUp={true}
      illustration={
        <div className="relative w-full h-full flex flex-col items-center justify-center text-white/90">
          {/* Placeholder Illustration - Replace with actual asset */}
          <svg
            viewBox="0 0 200 200"
            className="w-full h-auto drop-shadow-2xl"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M40 160 L160 160 L160 130 C160 90 130 90 100 90 C70 90 40 90 40 130 Z"
              fill="#E1E5F4"
              stroke="white"
              strokeWidth="2"
            />
            <circle
              cx="100"
              cy="70"
              r="30"
              fill="#E1E5F4"
              stroke="white"
              strokeWidth="2"
            />
            <path
              d="M50 120 L70 140 L100 110"
              stroke="#FFCC3E"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="160" cy="40" r="10" fill="#FFCC3E" />
            <path d="M150 120 L180 100" stroke="#FFCC3E" strokeWidth="2" />
          </svg>
          <p className="mt-8 text-center text-lg font-medium opacity-80">
            "The beautiful thing about learning is that no one can take it away
            from you."
          </p>
        </div>
      }
    >
      <div className="w-full space-y-6">
        {/* OAuth Buttons */}
        <div className="flex flex-col gap-3">
          <form action={signInWithGoogle}>
            <button
              type="submit"
              className="w-full h-12 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium rounded-full transition-all duration-200 flex items-center justify-center gap-3 relative group overflow-hidden"
            >
              <div className="absolute inset-0 bg-gray-100 opacity-0 group-hover:opacity-10 transition-opacity" />
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span>Sign up with Google</span>
            </button>
          </form>

          <form action={signInWithFacebook}>
            <button
              type="submit"
              className="w-full h-12 bg-[#1877F2] hover:bg-[#166FE5] text-white font-medium rounded-full transition-all duration-200 flex items-center justify-center gap-3 relative group overflow-hidden shadow-sm"
            >
              <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity" />
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              <span>Sign up with Facebook</span>
            </button>
          </form>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-gray-400">
              Or register with email
            </span>
          </div>
        </div>

        <form action={formAction} className="space-y-4">
          {state?.error && (
            <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm font-medium border border-red-100 flex items-center gap-2">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {state.error}
            </div>
          )}

          <div className="space-y-4">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors">
                <User className="w-5 h-5" />
              </div>
              <input
                type="text"
                name="name"
                required
                className="w-full pl-11 pr-4 py-3 bg-surface border-2 border-transparent focus:border-primary/10 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all outline-none shadow-sm group-hover:shadow-md"
                placeholder="Full Name"
              />
            </div>

            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors">
                <Mail className="w-5 h-5" />
              </div>
              <input
                type="email"
                name="email"
                required
                className="w-full pl-11 pr-4 py-3 bg-surface border-2 border-transparent focus:border-primary/10 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all outline-none shadow-sm group-hover:shadow-md"
                placeholder="Email Address"
              />
            </div>

            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors">
                <Lock className="w-5 h-5" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                required
                minLength={8}
                className="w-full pl-11 pr-12 py-3 bg-surface border-2 border-transparent focus:border-primary/10 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all outline-none shadow-sm group-hover:shadow-md"
                placeholder="Password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>

            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors">
                <CheckCircle className="w-5 h-5" />
              </div>
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                required
                minLength={8}
                className="w-full pl-11 pr-12 py-3 bg-surface border-2 border-transparent focus:border-primary/10 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all outline-none shadow-sm group-hover:shadow-md"
                placeholder="Confirm Password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full py-3 px-4 bg-secondary hover:bg-yellow-400 text-primary font-bold rounded-full shadow-lg shadow-yellow-200/50 transition-all duration-200 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-base"
          >
            {isPending ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        <p className="text-center text-gray-500 text-sm">
          Already have an account?{" "}
          <Link
            href="/sign-in"
            className="text-primary font-bold hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
