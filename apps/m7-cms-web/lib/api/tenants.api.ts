import { apiRequest } from "@/lib/api/client";

export type Tenant = {
  id: string;
  slug: string;
  name: string;
  domain: string | null;
  logoUrl: string | null;
  languages: string[];
  theme: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CreateTenantPayload = {
  slug: string;
  name: string;
  domain?: string;
  logoUrl?: string;
  languages?: string[];
  theme?: string;
};

export type UpdateTenantPayload = Partial<CreateTenantPayload>;

export async function listTenants(): Promise<{ data: Tenant[] }> {
  return apiRequest<{ data: Tenant[] }>("/tenants");
}

export async function getTenant(id: string): Promise<{ data: Tenant }> {
  return apiRequest<{ data: Tenant }>(`/tenants/${id}`);
}

export async function createTenant(
  data: CreateTenantPayload
): Promise<{ data: Tenant }> {
  return apiRequest<{ data: Tenant }>("/tenants", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateTenant(
  id: string,
  data: UpdateTenantPayload
): Promise<{ data: Tenant }> {
  return apiRequest<{ data: Tenant }>(`/tenants/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}
