"use client";

import { signInAction, type AuthActionResult } from "@/app/actions/auth";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useActionState } from "react";
import { Suspense } from "react";

const initialState: AuthActionResult = {};

function SignInForm() {
  const [state, formAction, isPending] = useActionState(
    signInAction,
    initialState
  );
  const searchParams = useSearchParams();
  const registered = searchParams.get("registered");
  const callbackUrl = searchParams.get("callbackUrl");

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
        <p className="text-gray-300">Sign in to your EduFlow account</p>
      </div>

      <form action={formAction} className="space-y-5">
        {registered && (
          <div className="bg-green-500/20 border border-green-500/50 text-green-200 px-4 py-3 rounded-lg text-sm">
            Account created successfully! Please sign in.
          </div>
        )}

        {state?.error && (
          <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg text-sm">
            {state.error}
          </div>
        )}

        <input
          type="hidden"
          name="callbackUrl"
          value={callbackUrl || "/dashboard"}
        />

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-200 mb-1.5"
          >
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-200 mb-1.5"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            required
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-lg shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? "Signing in..." : "Sign In"}
        </button>
      </form>

      <p className="mt-6 text-center text-gray-300">
        Don&apos;t have an account?{" "}
        <Link
          href="/sign-up"
          className="text-purple-400 hover:text-purple-300 font-medium transition"
        >
          Create one
        </Link>
      </p>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={<div className="text-white">Loading...</div>}>
      <SignInForm />
    </Suspense>
  );
}
