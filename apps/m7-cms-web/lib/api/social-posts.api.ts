import { apiRequest } from "@/lib/api/client";
import type { SocialPost, SocialPostFormValues } from "@/lib/schemas/social-post.schema";

export async function listSocialPosts(): Promise<SocialPost[]> {
  const res = await apiRequest<{ data: SocialPost[] }>("/social-posts");
  return res.data;
}

export async function createSocialPost(
  data: SocialPostFormValues
): Promise<SocialPost> {
  const res = await apiRequest<{ data: SocialPost }>("/social-posts", {
    method: "POST",
    body: JSON.stringify(data),
  });
  return res.data;
}

export async function updateSocialPost(
  id: string,
  data: Partial<SocialPostFormValues>
): Promise<SocialPost> {
  const res = await apiRequest<{ data: SocialPost }>(`/social-posts/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
  return res.data;
}

export async function deleteSocialPost(id: string): Promise<void> {
  return apiRequest<void>(`/social-posts/${id}`, {
    method: "DELETE",
  });
}

export async function reorderSocialPosts(
  orderedIds: string[]
): Promise<void> {
  return apiRequest<void>("/social-posts/reorder", {
    method: "PATCH",
    body: JSON.stringify({ orderedIds }),
  });
}
