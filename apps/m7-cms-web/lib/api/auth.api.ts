import { apiRequest } from "@/lib/api/client";
import type { TenantInfo, UserContext } from "@/types/auth";

export async function getCurrentUser(): Promise<UserContext> {
  return apiRequest<UserContext>("/users/me");
}

export async function getMyTenants(): Promise<TenantInfo[]> {
  const response = await apiRequest<{ data: TenantInfo[] }>("/users/me/tenants");
  return response.data;
}
