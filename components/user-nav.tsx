"use client";

import { signOutAction } from "@/app/actions/auth";
import { getRoleBadgeColor, getRoleDisplayName } from "@/lib/rbac";
import type { Session } from "next-auth";

interface UserNavProps {
  user: Session["user"];
}

export function UserNav({ user }: UserNavProps) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-3">
        {user.image ? (
          <img
            src={user.image}
            alt={user.name || "User"}
            className="w-10 h-10 rounded-full border-2 border-white/20"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold">
            {user.name?.charAt(0).toUpperCase() ||
              user.email?.charAt(0).toUpperCase() ||
              "U"}
          </div>
        )}
        <div className="hidden sm:flex flex-col">
          <span className="text-white font-medium text-sm">
            {user.name || user.email}
          </span>
          <span
            className={`text-xs px-2 py-0.5 rounded-full border inline-flex w-fit ${getRoleBadgeColor(
              user.role
            )}`}
          >
            {getRoleDisplayName(user.role)}
          </span>
        </div>
      </div>

      <form action={signOutAction}>
        <button
          type="submit"
          className="px-4 py-2 text-sm text-gray-300 hover:text-white bg-white/10 hover:bg-white/20 rounded-lg border border-white/20 transition-all"
        >
          Sign Out
        </button>
      </form>
    </div>
  );
}
