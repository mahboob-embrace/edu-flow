import "server-only";

import type { Role } from "@/types/roles";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { hasRole, hasMinimumRole } from "./rbac";

/**
 * Server-side role check utility for server components
 * Redirects to appropriate page if role check fails
 */
export async function requireRole(
  allowedRoles: Role[],
  redirectPath: string = "/dashboard"
): Promise<void> {
  const session = await auth();

  if (!session?.user) {
    redirect("/sign-in");
  }

  if (!hasRole(session.user.role, allowedRoles)) {
    redirect(redirectPath);
  }
}

/**
 * Server-side minimum role check utility
 * Redirects if user doesn't meet minimum role requirement
 */
export async function requireMinimumRole(
  minimumRole: Role,
  redirectPath: string = "/dashboard"
): Promise<void> {
  const session = await auth();

  if (!session?.user) {
    redirect("/sign-in");
  }

  if (!hasMinimumRole(session.user.role, minimumRole)) {
    redirect(redirectPath);
  }
}
