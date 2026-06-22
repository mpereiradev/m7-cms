"use client";

import { useAuth } from "@/lib/hooks/use-auth";
import type { Role } from "@/types/auth";

type RoleGuardProps = {
  /** Roles that are allowed to see the children */
  roles: Role[];
  /** Optional fallback to render when the user lacks permission */
  fallback?: React.ReactNode;
  children: React.ReactNode;
};

/**
 * Conditionally renders children based on the current user's role.
 * If the user's role is not in the `roles` array, children are hidden.
 *
 * @example
 * <RoleGuard roles={["admin", "super_admin"]}>
 *   <DeleteButton />
 * </RoleGuard>
 */
export function RoleGuard({ roles, fallback = null, children }: RoleGuardProps) {
  const { role, isLoading } = useAuth();

  if (isLoading) return null;
  if (!role || !roles.includes(role)) return <>{fallback}</>;

  return <>{children}</>;
}
