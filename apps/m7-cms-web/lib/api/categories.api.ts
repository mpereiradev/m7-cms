import { apiRequest } from "@/lib/api/client";
import type { Category } from "@/lib/schemas/category.schema";

export type PaginatedResponse<T> = {
  data: T[];
  total: number;
  page: number;
  perPage: number;
};

export type ListCategoriesParams = {
  page?: number;
  perPage?: number;
  search?: string;
  lang?: string;
};

export async function listCategories(
  params?: ListCategoriesParams
): Promise<PaginatedResponse<Category>> {
  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.set("page", String(params.page));
  if (params?.perPage) searchParams.set("perPage", String(params.perPage));
  if (params?.search) searchParams.set("search", params.search);
  if (params?.lang) searchParams.set("lang", params.lang);

  const query = searchParams.toString();
  return apiRequest<PaginatedResponse<Category>>(
    `/categories${query ? `?${query}` : ""}`
  );
}

export async function getCategory(id: string): Promise<{ data: Category }> {
  return apiRequest<{ data: Category }>(`/categories/${id}`);
}

export async function createCategory(
  data: Record<string, unknown>
): Promise<{ data: Category }> {
  return apiRequest<{ data: Category }>("/categories", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateCategory(
  id: string,
  data: Record<string, unknown>
): Promise<{ data: Category }> {
  return apiRequest<{ data: Category }>(`/categories/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function deleteCategory(id: string): Promise<void> {
  return apiRequest<void>(`/categories/${id}`, { method: "DELETE" });
}
