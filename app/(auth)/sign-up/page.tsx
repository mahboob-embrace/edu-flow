"use client";

import { signUpAction, type AuthActionResult } from "@/app/actions/auth";
import { signInWithGoogle, signInWithFacebook } from "@/app/actions/oauth";
import Link from "next/link";
import { useActionState, useState } from "react";
import { User, Mail, Lock, Eye, EyeOff } from "lucide-react";

const initialState: AuthActionResult = {};

export default function SignUpPage() {
  const [state, formAction, isPending] = useActionState(
    signUpAction,
    initialState
  );
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="animate-in fade-in slide-in-from-left-4 duration-500">
      <h1 className="text-4xl font-bold text-[#050A30] mb-8">
        Let&apos;s Get Started
      </h1>

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

        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#050A30]">
            <User size={20} />
          </div>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            className="block w-full pl-12 pr-4 py-3 border-2 border-gray-100 rounded-full text-[#050A30] focus:outline-none focus:border-[#FFD15B] transition-colors"
            required
          />
        </div>

        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#050A30]">
            <Mail size={20} />
          </div>
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="block w-full pl-12 pr-4 py-3 border-2 border-gray-100 rounded-full text-[#050A30] focus:outline-none focus:border-[#FFD15B] transition-colors"
            required
          />
        </div>

        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#050A30]">
            <Lock size={20} />
          </div>
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            minLength={8}
            className="block w-full pl-12 pr-12 py-3 border-2 border-gray-100 rounded-full text-[#050A30] focus:outline-none focus:border-[#FFD15B] transition-colors"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-[#050A30]"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#050A30]">
            <Lock size={20} />
          </div>
          <input
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            placeholder="Repeat Password"
            minLength={8}
            className="block w-full pl-12 pr-12 py-3 border-2 border-gray-100 rounded-full text-[#050A30] focus:outline-none focus:border-[#FFD15B] transition-colors"
            required
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-[#050A30]"
          >
            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full py-4 bg-[#FFD15B] hover:bg-[#ffc634] text-[#050A30] font-bold rounded-full shadow-lg shadow-yellow-100 transform active:scale-[0.98] transition-all mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? "Creating Account..." : "Sign Up"}
        </button>
      </form>

      <p className="mt-8 text-center text-gray-600">
        Already have an account?{" "}
        <Link
          href="/sign-in"
          className="text-[#050A30] font-bold hover:underline"
        >
          Log in
        </Link>
      </p>
    </div>
  );
}
