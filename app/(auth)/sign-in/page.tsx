"use client";

import { signInAction, type AuthActionResult } from "@/app/actions/auth";
import { signInWithGoogle, signInWithFacebook } from "@/app/actions/oauth";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useActionState } from "react";
import { Suspense, useState } from "react";
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
    <div className="animate-in fade-in slide-in-from-left-4 duration-500">
      <h1 className="text-4xl font-bold text-[#050A30] mb-8">Welcome Back</h1>

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

        <button
          type="submit"
          disabled={isPending}
          className="w-full py-4 bg-[#FFD15B] hover:bg-[#ffc634] text-[#050A30] font-bold rounded-full shadow-lg shadow-yellow-100 transform active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? "Signing in..." : "Sign In"}
        </button>
      </form>

      <div className="flex items-center my-6">
        <div className="flex-1 border-t border-gray-200"></div>
        <span className="px-3 text-xs text-gray-400 font-medium uppercase tracking-wider">
          OR
        </span>
        <div className="flex-1 border-t border-gray-200"></div>
      </div>

      <div className="space-y-3">
        <form action={signInWithGoogle}>
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-3 py-3 rounded-full font-medium transition-all transform active:scale-[0.99] bg-[#050A30] text-white hover:bg-[#0a1142]"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M5.26620003,9.76451327 C6.19908612,6.93863203 8.85444915,4.90909091 12,4.90909091 C13.6909091,4.90909091 15.2181818,5.50909091 16.4181818,6.49090909 L19.9090909,3 C17.7818182,1.14545455 15.0545455,0 12,0 C7.2700695,0 3.19774976,2.69829785 1.2402802,6.65091696 L5.26620003,9.76451327 Z"
              />
              <path
                fill="#34A853"
                d="M16.0407269,18.0125889 C14.9509167,18.7163016 13.5660892,19.0909091 12,19.0909091 C8.85444915,19.0909091 6.19908612,17.061368 5.26620003,14.2354867 L1.2402802,17.349083 C3.19774976,21.3017022 7.2700695,24 12,24 C15,24 17.7,23 19.8,21.3 L16.0407269,18.0125889 Z"
              />
              <path
                fill="#4285F4"
                d="M19.8,21.3 C22.4,19.1 24,15.8 24,12 C24,11.3 23.9,10.6 23.8,10 L12,10 L12,14.6363636 L18.7,14.6363636 C18.4,16 17.5,17.2 16.3,18 C16.2,18.1 16.1,18.1 16,18.2 L19.8,21.3 Z"
              />
              <path
                fill="#FBBC05"
                d="M5.26620003,14.2354867 C5.03303788,13.5273326 4.90909091,12.7781375 4.90909091,12 C4.90909091,11.2218625 5.03303788,10.4726674 5.26620003,9.76451327 L1.2402802,6.65091696 C0.448585646,8.25817332 0,10.0770559 0,12 C0,13.9229441 0.448585646,15.7418267 1.2402802,17.349083 L5.26620003,14.2354867 Z"
              />
            </svg>
            <span className="text-sm">Sign in with Google</span>
          </button>
        </form>

        <form action={signInWithFacebook}>
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-3 py-3 rounded-full font-medium transition-all transform active:scale-[0.99] bg-[#1877F2] text-white hover:bg-[#166fe5]"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
            <span className="text-sm">Sign in with Facebook</span>
          </button>
        </form>
      </div>

      <p className="mt-8 text-center text-gray-600">
        Don&apos;t have an account?{" "}
        <Link
          href="/sign-up"
          className="text-[#050A30] font-bold hover:underline"
        >
          Sign Up
        </Link>
      </p>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#DDE2F5]">
          Loading...
        </div>
      }
    >
      <SignInForm />
    </Suspense>
  );
}
