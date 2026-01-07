import bcrypt from "bcrypt";
import type { Role } from "@/types/roles";
import type { Session } from "next-auth";

const SALT_ROUNDS = 12;

/**
 * Hash a password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Verify a password against a hash
 */
export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Check if the user has one of the allowed roles
 */
export function checkRole(
  session: Session | null,
  allowedRoles: Role[]
): boolean {
  if (!session?.user?.role) {
    return false;
  }
  return allowedRoles.includes(session.user.role);
}

/**
 * Role hierarchy for permission checks
 * Higher index = more permissions
 */
export const ROLE_HIERARCHY: Role[] = ["GUEST", "USER", "ADMIN", "SUPER_ADMIN"];

/**
 * Check if a user's role meets or exceeds the minimum required role
 */
export function hasMinimumRole(userRole: Role, minimumRole: Role): boolean {
  const userRoleIndex = ROLE_HIERARCHY.indexOf(userRole);
  const minimumRoleIndex = ROLE_HIERARCHY.indexOf(minimumRole);
  return userRoleIndex >= minimumRoleIndex;
}
