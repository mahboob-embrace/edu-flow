import type { Role } from "@/types/roles";

/**
 * Role hierarchy for permission checks
 * Higher index = more permissions
 */
export const ROLE_HIERARCHY: Role[] = ["GUEST", "USER", "ADMIN", "SUPER_ADMIN"];

/**
 * Get role display name
 */
export function getRoleDisplayName(role: Role): string {
  const displayNames: Record<Role, string> = {
    SUPER_ADMIN: "Super Admin",
    ADMIN: "Admin",
    USER: "User",
    GUEST: "Guest",
  };
  return displayNames[role];
}

/**
 * Get role badge color class
 */
export function getRoleBadgeColor(role: Role): string {
  const colors: Record<Role, string> = {
    SUPER_ADMIN: "bg-red-500/20 text-red-300 border-red-500/50",
    ADMIN: "bg-purple-500/20 text-purple-300 border-purple-500/50",
    USER: "bg-blue-500/20 text-blue-300 border-blue-500/50",
    GUEST: "bg-gray-500/20 text-gray-300 border-gray-500/50",
  };
  return colors[role];
}

/**
 * Check if a user's role meets or exceeds the minimum required role
 */
export function hasMinimumRole(userRole: Role, minimumRole: Role): boolean {
  const userRoleIndex = ROLE_HIERARCHY.indexOf(userRole);
  const minimumRoleIndex = ROLE_HIERARCHY.indexOf(minimumRole);
  return userRoleIndex >= minimumRoleIndex;
}

/**
 * Check if user has one of the allowed roles
 */
export function hasRole(userRole: Role, allowedRoles: Role[]): boolean {
  return allowedRoles.includes(userRole);
}
