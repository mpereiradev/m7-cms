import { apiRequest } from "@/lib/api/client";
import type { Role } from "@/types/auth";

// --- Types ---

export type TenantUser = {
  id: string;
  userId: string;
  tenantId: string;
  email: string;
  name: string | null;
  role: Role;
  photoUrl: string | null;
  createdAt: string;
};

export type UserTenantAssociation = {
  tenantId: string;
  tenantName: string;
  tenantSlug: string;
  role: Role;
};

export type GlobalUser = {
  userId: string;
  email: string;
  name: string | null;
  photoUrl: string | null;
  tenants: UserTenantAssociation[];
};

export type UserListResponse = {
  data: TenantUser[] | GlobalUser[];
};

export type InviteUserPayload = {
  email: string;
  role: Role;
};

export type UpdateRolePayload = {
  role: Role;
};

// --- API functions ---

export async function listUsers(params?: {
  page?: number;
  perPage?: number;
  search?: string;
}): Promise<UserListResponse> {
  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.set("page", String(params.page));
  if (params?.perPage) searchParams.set("perPage", String(params.perPage));
  if (params?.search) searchParams.set("search", params.search);

  const query = searchParams.toString();
  return apiRequest<UserListResponse>(`/users${query ? `?${query}` : ""}`);
}

export function isGlobalUser(user: TenantUser | GlobalUser): user is GlobalUser {
  return "tenants" in user;
}

export async function inviteUser(data: InviteUserPayload): Promise<void> {
  return apiRequest<void>("/users/invite", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateRole(
  userId: string,
  data: UpdateRolePayload
): Promise<void> {
  return apiRequest<void>(`/users/${userId}/role`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function removeUser(userId: string): Promise<void> {
  return apiRequest<void>(`/users/${userId}`, {
    method: "DELETE",
  });
}

export type CreateUserDirectPayload = {
  email: string;
  name: string;
  password: string;
  tenantId: string;
  role: Role;
};

export async function createUserDirect(
  data: CreateUserDirectPayload
): Promise<{ data: TenantUser }> {
  return apiRequest<{ data: TenantUser }>("/users/direct", {
    method: "POST",
    body: JSON.stringify(data),
  });
}
