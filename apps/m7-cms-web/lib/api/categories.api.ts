import { apiRequest } from "@/lib/api/client";
import type { Category } from "@/lib/schemas/category.schema";

export async function listCategories(): Promise<Category[]> {
  const res = await apiRequest<{ data: Category[] }>("/categories");
  return res.data;
}

export async function getCategory(id: string): Promise<Category> {
  const res = await apiRequest<{ data: Category }>(`/categories/${id}`);
  return res.data;
}

export async function createCategory(
  data: Record<string, unknown>
): Promise<Category> {
  const res = await apiRequest<{ data: Category }>("/categories", {
    method: "POST",
    body: JSON.stringify(data),
  });
  return res.data;
}

export async function updateCategory(
  id: string,
  data: Record<string, unknown>
): Promise<Category> {
  const res = await apiRequest<{ data: Category }>(`/categories/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  return res.data;
}

export async function deleteCategory(id: string): Promise<void> {
  return apiRequest<void>(`/categories/${id}`, { method: "DELETE" });
}
