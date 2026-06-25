import { apiRequest } from "@/lib/api/client";

export type StoreTranslation = {
  id: string;
  languageCode: string;
  name: string;
  address: string | null;
  description: string | null;
  email: string | null;
  phone: string | null;
  whatsapp: string | null;
};

export type StoreHour = {
  id: string;
  weekday: number;
  openTime: string;
  closeTime: string;
};

export type Store = {
  id: string;
  tenantId: string;
  slug: string;
  mapUrl: string | null;
  translations: StoreTranslation[];
  hours: StoreHour[];
  createdAt: string;
  updatedAt: string;
};

export async function setStoreHours(
  id: string,
  data: { hours: { weekday: number; openTime: string; closeTime: string }[] }
): Promise<Store> {
  const res = await apiRequest<{ data: Store }>(`/stores/${id}/hours`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  return res.data;
}

export async function listStores(): Promise<Store[]> {
  const res = await apiRequest<{ data: Store[] }>("/stores");
  return res.data;
}

export async function getStore(id: string): Promise<Store> {
  const res = await apiRequest<{ data: Store }>(`/stores/${id}`);
  return res.data;
}

export async function createStore(data: Record<string, unknown>): Promise<Store> {
  const res = await apiRequest<{ data: Store }>("/stores", {
    method: "POST",
    body: JSON.stringify(data),
  });
  return res.data;
}

export async function updateStore(
  id: string,
  data: Record<string, unknown>
): Promise<Store> {
  const res = await apiRequest<{ data: Store }>(`/stores/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  return res.data;
}

export async function deleteStore(id: string): Promise<void> {
  return apiRequest<void>(`/stores/${id}`, { method: "DELETE" });
}
