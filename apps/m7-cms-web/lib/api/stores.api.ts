import { apiRequest } from "@/lib/api/client";

// --- Types ---

export type StoreHours = {
  dayOfWeek: number; // 0=Sunday, 1=Monday, ..., 6=Saturday
  isOpen: boolean;
  openTime: string | null; // "HH:mm"
  closeTime: string | null; // "HH:mm"
};

export type Store = {
  id: string;
  tenantId: string;
  name: string;
  slug: string;
  address: string | null;
  city: string | null;
  state: string | null;
  zipCode: string | null;
  phone: string | null;
  email: string | null;
  mapUrl: string | null;
  description: string | null;
  isActive: boolean;
  hours: StoreHours[];
  createdAt: string;
  updatedAt: string;
};

export type CreateStorePayload = {
  name: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  phone?: string;
  email?: string;
  mapUrl?: string;
  description?: string;
  isActive?: boolean;
};

export type UpdateStorePayload = Partial<CreateStorePayload>;

export type SetStoreHoursPayload = {
  hours: StoreHours[];
};

export type StoreListResponse = {
  data: Store[];
  total: number;
  page: number;
  perPage: number;
};

// --- API functions ---

export async function listStores(params?: {
  page?: number;
  perPage?: number;
  search?: string;
}): Promise<StoreListResponse> {
  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.set("page", String(params.page));
  if (params?.perPage) searchParams.set("perPage", String(params.perPage));
  if (params?.search) searchParams.set("search", params.search);

  const query = searchParams.toString();
  return apiRequest<StoreListResponse>(`/stores${query ? `?${query}` : ""}`);
}

export async function getStore(id: string): Promise<Store> {
  return apiRequest<Store>(`/stores/${id}`);
}

export async function createStore(data: CreateStorePayload): Promise<Store> {
  return apiRequest<Store>("/stores", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateStore(
  id: string,
  data: UpdateStorePayload
): Promise<Store> {
  return apiRequest<Store>(`/stores/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function deleteStore(id: string): Promise<void> {
  return apiRequest<void>(`/stores/${id}`, {
    method: "DELETE",
  });
}

export async function setStoreHours(
  id: string,
  data: SetStoreHoursPayload
): Promise<Store> {
  return apiRequest<Store>(`/stores/${id}/hours`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}
