import { apiRequest } from "@/lib/api/client";
import type { TenantInfo, UserContext } from "@/types/auth";

/**
 * Fetch the currently authenticated user's profile, including role and tenant info.
 */
export async function getCurrentUser(): Promise<UserContext> {
  return apiRequest<UserContext>("/users/me");
}

/**
 * Fetch the list of tenants the current user belongs to.
 */
export async function getMyTenants(): Promise<TenantInfo[]> {
  return apiRequest<TenantInfo[]>("/users/me/tenants");
}
