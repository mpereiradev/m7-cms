import { apiRequest } from "@/lib/api/client";

export type Tag = {
  id: string;
  tenantId: string;
  name: string;
  slug: string;
  createdAt: string;
};

export type PaginatedResponse<T> = {
  data: T[];
  total: number;
  page: number;
  perPage: number;
};

export type ListTagsParams = {
  page?: number;
  perPage?: number;
  search?: string;
};

export async function listTags(
  params?: ListTagsParams
): Promise<PaginatedResponse<Tag>> {
  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.set("page", String(params.page));
  if (params?.perPage) searchParams.set("perPage", String(params.perPage));
  if (params?.search) searchParams.set("search", params.search);

  const query = searchParams.toString();
  return apiRequest<PaginatedResponse<Tag>>(
    `/tags${query ? `?${query}` : ""}`
  );
}

export async function createTag(
  data: { name: string; slug: string }
): Promise<{ data: Tag }> {
  return apiRequest<{ data: Tag }>("/tags", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function deleteTag(id: string): Promise<void> {
  return apiRequest<void>(`/tags/${id}`, { method: "DELETE" });
}
