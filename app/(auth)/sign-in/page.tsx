"use client";

import { signInAction, type AuthActionResult } from "@/app/actions/auth";
import { signInWithGoogle, signInWithFacebook } from "@/app/actions/oauth";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useActionState } from "react";
import { Suspense, useState } from "react";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";

const initialState: AuthActionResult = {};

function SignInForm() {
  const [state, formAction, isPending] = useActionState(
    signInAction,
    initialState
  );
  const searchParams = useSearchParams();
  const registered = searchParams.get("registered");
  const callbackUrl = searchParams.get("callbackUrl");
  const [showPassword, setShowPassword] = useState(false);

  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Sign in to your EduFlow account"
      illustration={
        <div className="relative w-full flex flex-col items-center justify-center">
          {/* Student at laptop illustration */}
          <div className="relative w-64 h-64">
            {/* Yellow background blob */}
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full"
              style={{ backgroundColor: "#FFCC3E" }}
            />

            {/* Student figure */}
            <svg viewBox="0 0 200 200" className="relative z-10 w-full h-full">
              {/* Desk */}
              <rect
                x="40"
                y="130"
                width="120"
                height="8"
                rx="2"
                fill="#E1E5F4"
              />
              <rect x="50" y="138" width="10" height="30" fill="#E1E5F4" />
              <rect x="140" y="138" width="10" height="30" fill="#E1E5F4" />

              {/* Laptop */}
              <rect x="60" y="100" width="80" height="30" rx="3" fill="white" />
              <rect
                x="65"
                y="105"
                width="70"
                height="20"
                rx="2"
                fill="#030047"
              />
              <rect
                x="50"
                y="128"
                width="100"
                height="5"
                rx="1"
                fill="#E1E5F4"
              />

              {/* Person body */}
              <ellipse cx="100" cy="85" rx="20" ry="15" fill="#FFCC3E" />

              {/* Person head */}
              <circle cx="100" cy="55" r="18" fill="#E1E5F4" />
              <circle cx="94" cy="52" r="2" fill="#030047" />
              <circle cx="106" cy="52" r="2" fill="#030047" />
              <path
                d="M95 60 Q100 65 105 60"
                stroke="#030047"
                strokeWidth="2"
                fill="none"
              />

              {/* Hair */}
              <path d="M82 50 Q85 35 100 35 Q115 35 118 50" fill="#030047" />

              {/* Arms */}
              <path
                d="M80 85 L65 105"
                stroke="#E1E5F4"
                strokeWidth="6"
                strokeLinecap="round"
              />
              <path
                d="M120 85 L135 105"
                stroke="#E1E5F4"
                strokeWidth="6"
                strokeLinecap="round"
              />

              {/* Decorative elements */}
              <circle cx="160" cy="40" r="5" fill="#FFCC3E" opacity="0.6" />
              <circle cx="40" cy="60" r="3" fill="#FFCC3E" opacity="0.6" />
              <path
                d="M150 80 L165 75"
                stroke="white"
                strokeWidth="2"
                opacity="0.5"
              />
              <path
                d="M35 90 L45 85"
                stroke="white"
                strokeWidth="2"
                opacity="0.5"
              />

              {/* Globe icon */}
              <circle
                cx="165"
                cy="60"
                r="12"
                stroke="white"
                strokeWidth="2"
                fill="none"
                opacity="0.7"
              />
              <path
                d="M153 60 Q165 50 177 60"
                stroke="white"
                strokeWidth="1"
                fill="none"
                opacity="0.7"
              />
              <line
                x1="165"
                y1="48"
                x2="165"
                y2="72"
                stroke="white"
                strokeWidth="1"
                opacity="0.7"
              />

              {/* Graduation cap */}
              <polygon
                points="35,35 50,25 65,35 50,45"
                fill="white"
                opacity="0.8"
              />
              <line
                x1="50"
                y1="25"
                x2="50"
                y2="15"
                stroke="white"
                strokeWidth="2"
                opacity="0.8"
              />
            </svg>
          </div>

          <p className="mt-6 text-center text-sm font-medium text-white/80 max-w-xs">
            "Education is the passport to the future, for tomorrow belongs to
            those who prepare for it today."
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
              className="w-full h-12 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium rounded-full transition-all duration-200 flex items-center justify-center gap-3"
            >
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
              <span>Sign in with Google</span>
            </button>
          </form>

          <form action={signInWithFacebook}>
            <button
              type="submit"
              className="w-full h-12 text-white font-medium rounded-full transition-all duration-200 flex items-center justify-center gap-3"
              style={{ backgroundColor: "#1877F2" }}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              <span>Sign in with Facebook</span>
            </button>
          </form>
        </div>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span
              className="px-3 text-gray-400"
              style={{ backgroundColor: "#FBFBFF" }}
            >
              Or sign in with email
            </span>
          </div>
        </div>

        {/* Credentials Form */}
        <form action={formAction} className="space-y-4">
          {registered && (
            <div className="p-3 rounded-lg bg-green-50 text-green-600 text-sm font-medium border border-green-100 flex items-center gap-2">
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
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Account created successfully! Please sign in.
            </div>
          )}

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

          <input
            type="hidden"
            name="callbackUrl"
            value={callbackUrl || "/dashboard"}
          />

          <div className="space-y-4">
            {/* Email Input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                <Mail className="w-5 h-5" />
              </div>
              <input
                type="email"
                name="email"
                required
                className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-full text-gray-800 placeholder-gray-400 focus:outline-none focus:border-gray-300 focus:ring-2 focus:ring-gray-100 transition-all"
                placeholder="Email Address"
              />
            </div>

            {/* Password Input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                <Lock className="w-5 h-5" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                required
                className="w-full pl-12 pr-12 py-3.5 bg-white border border-gray-200 rounded-full text-gray-800 placeholder-gray-400 focus:outline-none focus:border-gray-300 focus:ring-2 focus:ring-gray-100 transition-all"
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
          </div>

          {/* Sign In Button - Solid Gold */}
          <button
            type="submit"
            disabled={isPending}
            className="w-full py-3.5 px-4 font-bold rounded-full transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-base"
            style={{
              backgroundColor: "#FFCC3E",
              color: "#030047",
              boxShadow: "0 4px 14px rgba(255, 204, 62, 0.4)",
            }}
          >
            {isPending ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="text-center text-gray-500 text-sm">
          Don&apos;t have an account?{" "}
          <Link
            href="/sign-up"
            className="font-bold hover:underline"
            style={{ color: "#030047" }}
          >
            Create one
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}

export default function SignInPage() {
  return (
    <Suspense
      fallback={
        <div
          className="min-h-screen flex items-center justify-center"
          style={{ backgroundColor: "#FBFBFF", color: "#030047" }}
        >
          Loading...
        </div>
      }
    >
      <SignInForm />
    </Suspense>
  );
}
