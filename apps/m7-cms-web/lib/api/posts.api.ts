import { apiRequest } from "@/lib/api/client";
import type { Post, PostListItem } from "@/lib/schemas/post.schema";

export type PaginatedResponse<T> = {
  data: T[];
  total: number;
  page: number;
  perPage: number;
};

export type ListPostsParams = {
  page?: number;
  perPage?: number;
  search?: string;
  status?: "draft" | "published" | "scheduled";
  categoryId?: string;
  tagId?: string;
  lang?: string;
};

export async function listPosts(
  params?: ListPostsParams
): Promise<PaginatedResponse<PostListItem>> {
  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.set("page", String(params.page));
  if (params?.perPage) searchParams.set("perPage", String(params.perPage));
  if (params?.search) searchParams.set("search", params.search);
  if (params?.status) searchParams.set("status", params.status);
  if (params?.categoryId) searchParams.set("categoryId", params.categoryId);
  if (params?.tagId) searchParams.set("tagId", params.tagId);
  if (params?.lang) searchParams.set("lang", params.lang);

  const query = searchParams.toString();
  return apiRequest<PaginatedResponse<PostListItem>>(
    `/posts${query ? `?${query}` : ""}`
  );
}

export async function getPost(id: string): Promise<{ data: Post }> {
  return apiRequest<{ data: Post }>(`/posts/${id}`);
}

export async function createPost(
  data: Record<string, unknown>
): Promise<{ data: Post }> {
  return apiRequest<{ data: Post }>("/posts", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updatePost(
  id: string,
  data: Record<string, unknown>
): Promise<{ data: Post }> {
  return apiRequest<{ data: Post }>(`/posts/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function deletePost(id: string): Promise<void> {
  return apiRequest<void>(`/posts/${id}`, { method: "DELETE" });
}

export async function publishPost(id: string): Promise<{ data: Post }> {
  return apiRequest<{ data: Post }>(`/posts/${id}/publish`, {
    method: "PATCH",
  });
}
