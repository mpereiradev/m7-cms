import { apiRequest } from "@/lib/api/client";
import type { Role } from "@/types/auth";

// --- Types ---

export type TenantUser = {
  id: string;
  email: string;
  fullName: string | null;
  avatarUrl: string | null;
  role: Role;
  lastSignInAt: string | null;
  createdAt: string;
};

export type UserListResponse = {
  data: TenantUser[];
  total: number;
  page: number;
  perPage: number;
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
