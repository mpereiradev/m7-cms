import { apiRequest } from "@/lib/api/client";
import type { Page, PageListItem } from "@/lib/schemas/page.schema";

export type PaginatedResponse<T> = {
  data: T[];
  total: number;
  page: number;
  perPage: number;
};

export type ListPagesParams = {
  page?: number;
  perPage?: number;
  search?: string;
  status?: "published" | "draft";
  lang?: string;
};

export async function listPages(
  params?: ListPagesParams
): Promise<PaginatedResponse<PageListItem>> {
  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.set("page", String(params.page));
  if (params?.perPage) searchParams.set("perPage", String(params.perPage));
  if (params?.search) searchParams.set("search", params.search);
  if (params?.status) searchParams.set("status", params.status);
  if (params?.lang) searchParams.set("lang", params.lang);

  const query = searchParams.toString();
  return apiRequest<PaginatedResponse<PageListItem>>(
    `/pages${query ? `?${query}` : ""}`
  );
}

export async function getPage(id: string): Promise<{ data: Page }> {
  return apiRequest<{ data: Page }>(`/pages/${id}`);
}

export async function createPage(
  data: Record<string, unknown>
): Promise<{ data: Page }> {
  return apiRequest<{ data: Page }>("/pages", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updatePage(
  id: string,
  data: Record<string, unknown>
): Promise<{ data: Page }> {
  return apiRequest<{ data: Page }>(`/pages/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function deletePage(id: string): Promise<void> {
  return apiRequest<void>(`/pages/${id}`, { method: "DELETE" });
}

export async function addSection(
  pageId: string,
  data: { sectionType: string; content: Record<string, unknown> }
): Promise<{ data: unknown }> {
  return apiRequest<{ data: unknown }>(`/pages/${pageId}/sections`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function reorderSections(
  pageId: string,
  sectionIds: string[]
): Promise<void> {
  return apiRequest<void>(`/pages/${pageId}/sections/reorder`, {
    method: "PATCH",
    body: JSON.stringify({ sectionIds }),
  });
}
