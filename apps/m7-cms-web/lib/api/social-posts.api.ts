import { apiRequest } from "@/lib/api/client";
import type { SocialPost, SocialPostFormValues } from "@/lib/schemas/social-post.schema";

/**
 * Fetch all social posts for the current tenant.
 */
export async function listSocialPosts(): Promise<SocialPost[]> {
  return apiRequest<SocialPost[]>("/social-posts");
}

/**
 * Create a new social post.
 */
export async function createSocialPost(
  data: SocialPostFormValues
): Promise<SocialPost> {
  return apiRequest<SocialPost>("/social-posts", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/**
 * Update an existing social post.
 */
export async function updateSocialPost(
  id: string,
  data: Partial<SocialPostFormValues>
): Promise<SocialPost> {
  return apiRequest<SocialPost>(`/social-posts/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

/**
 * Delete a social post.
 */
export async function deleteSocialPost(id: string): Promise<void> {
  return apiRequest<void>(`/social-posts/${id}`, {
    method: "DELETE",
  });
}

/**
 * Reorder social posts by sending an ordered list of IDs.
 */
export async function reorderSocialPosts(
  orderedIds: string[]
): Promise<void> {
  return apiRequest<void>("/social-posts/reorder", {
    method: "PATCH",
    body: JSON.stringify({ orderedIds }),
  });
}
