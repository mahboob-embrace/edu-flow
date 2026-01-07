/**
 * Role enum - mirrors the Prisma schema Role enum
 * This is defined here to avoid importing from @prisma/client in edge runtime
 */
export type Role = "SUPER_ADMIN" | "ADMIN" | "USER" | "GUEST";

export const Role = {
  SUPER_ADMIN: "SUPER_ADMIN" as const,
  ADMIN: "ADMIN" as const,
  USER: "USER" as const,
  GUEST: "GUEST" as const,
};
