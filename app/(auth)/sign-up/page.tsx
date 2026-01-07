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
        <div className="relative w-full flex flex-col items-center justify-center">
          {/* Student with book illustration */}
          <div className="relative w-64 h-64">
            {/* Yellow background blob */}
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full"
              style={{ backgroundColor: "#FFCC3E" }}
            />

            {/* Student figure */}
            <svg viewBox="0 0 200 200" className="relative z-10 w-full h-full">
              {/* Person body */}
              <ellipse cx="100" cy="120" rx="30" ry="40" fill="#FFCC3E" />

              {/* Person head */}
              <circle cx="100" cy="60" r="25" fill="#E1E5F4" />
              <circle cx="92" cy="55" r="3" fill="#030047" />
              <circle cx="108" cy="55" r="3" fill="#030047" />
              <path
                d="M95 68 Q100 73 105 68"
                stroke="#030047"
                strokeWidth="2"
                fill="none"
              />

              {/* Hair */}
              <path d="M75 55 Q80 30 100 30 Q120 30 125 55" fill="#030047" />

              {/* Book */}
              <rect
                x="60"
                y="100"
                width="45"
                height="60"
                rx="3"
                fill="white"
                transform="rotate(-10 80 130)"
              />
              <rect
                x="65"
                y="105"
                width="35"
                height="50"
                rx="2"
                fill="#030047"
                transform="rotate(-10 80 130)"
                opacity="0.1"
              />
              <line
                x1="82"
                y1="110"
                x2="82"
                y2="155"
                stroke="#030047"
                strokeWidth="2"
                transform="rotate(-10 80 130)"
              />

              {/* Arms holding book */}
              <path
                d="M70 100 L55 115"
                stroke="#E1E5F4"
                strokeWidth="8"
                strokeLinecap="round"
              />
              <path
                d="M130 100 L115 110"
                stroke="#E1E5F4"
                strokeWidth="8"
                strokeLinecap="round"
              />

              {/* Decorative elements */}
              <circle cx="160" cy="40" r="6" fill="#FFCC3E" opacity="0.6" />
              <circle cx="45" cy="50" r="4" fill="#FFCC3E" opacity="0.6" />
              <circle cx="170" cy="100" r="3" fill="white" opacity="0.5" />

              {/* Stars */}
              <path
                d="M155 70 L158 76 L165 76 L160 80 L162 87 L155 83 L148 87 L150 80 L145 76 L152 76 Z"
                fill="white"
                opacity="0.7"
              />
              <path
                d="M40 80 L42 84 L47 84 L43 87 L45 92 L40 89 L35 92 L37 87 L33 84 L38 84 Z"
                fill="white"
                opacity="0.5"
                transform="scale(0.7) translate(20 30)"
              />

              {/* Pencil */}
              <rect
                x="165"
                y="120"
                width="6"
                height="35"
                rx="1"
                fill="white"
                transform="rotate(20 168 137)"
              />
              <polygon
                points="168,155 165,165 171,165"
                fill="#FFCC3E"
                transform="rotate(20 168 160)"
              />

              {/* Globe */}
              <circle
                cx="35"
                cy="130"
                r="15"
                stroke="white"
                strokeWidth="2"
                fill="none"
                opacity="0.6"
              />
              <ellipse
                cx="35"
                cy="130"
                rx="15"
                ry="6"
                stroke="white"
                strokeWidth="1"
                fill="none"
                opacity="0.6"
              />
              <line
                x1="35"
                y1="115"
                x2="35"
                y2="145"
                stroke="white"
                strokeWidth="1"
                opacity="0.6"
              />
            </svg>
          </div>

          <p className="mt-6 text-center text-sm font-medium text-white/80 max-w-xs">
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
              <span>Sign up with Google</span>
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
              <span>Sign up with Facebook</span>
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
              Or register with email
            </span>
          </div>
        </div>

        {/* Form */}
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
            {/* Full Name */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                <User className="w-5 h-5" />
              </div>
              <input
                type="text"
                name="name"
                required
                className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-full text-gray-800 placeholder-gray-400 focus:outline-none focus:border-gray-300 focus:ring-2 focus:ring-gray-100 transition-all"
                placeholder="Full Name"
              />
            </div>

            {/* Email */}
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

            {/* Password */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                <Lock className="w-5 h-5" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                required
                minLength={8}
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

            {/* Confirm Password */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                <CheckCircle className="w-5 h-5" />
              </div>
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                required
                minLength={8}
                className="w-full pl-12 pr-12 py-3.5 bg-white border border-gray-200 rounded-full text-gray-800 placeholder-gray-400 focus:outline-none focus:border-gray-300 focus:ring-2 focus:ring-gray-100 transition-all"
                placeholder="Repeat Password"
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

          {/* Sign Up Button - Solid Gold */}
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
            {isPending ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        <p className="text-center text-gray-500 text-sm">
          Already have an account?{" "}
          <Link
            href="/sign-in"
            className="font-bold hover:underline"
            style={{ color: "#030047" }}
          >
            Log in
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
