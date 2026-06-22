import { apiRequest } from "@/lib/api/client";
import type {
  CreateVideoInput,
  PaginatedResponse,
  VideoItem,
} from "@/types/media";

/**
 * List videos for a gallery.
 */
export async function listVideos(params?: {
  galleryId?: string;
  page?: number;
  perPage?: number;
}): Promise<PaginatedResponse<VideoItem>> {
  const searchParams = new URLSearchParams();
  if (params?.galleryId) searchParams.set("galleryId", String(params.galleryId));
  if (params?.page) searchParams.set("page", String(params.page));
  if (params?.perPage) searchParams.set("perPage", String(params.perPage));

  const query = searchParams.toString();
  return apiRequest<PaginatedResponse<VideoItem>>(
    `/videos${query ? `?${query}` : ""}`
  );
}

/**
 * Get a single video by ID.
 */
export async function getVideo(id: string): Promise<VideoItem> {
  return apiRequest<VideoItem>(`/videos/${id}`);
}

/**
 * Create a new video entry.
 */
export async function createVideo(data: CreateVideoInput): Promise<VideoItem> {
  return apiRequest<VideoItem>("/videos", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/**
 * Update a video.
 */
export async function updateVideo(
  id: string,
  data: Partial<CreateVideoInput>
): Promise<VideoItem> {
  return apiRequest<VideoItem>(`/videos/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

/**
 * Delete a video.
 */
export async function deleteVideo(id: string): Promise<void> {
  return apiRequest<void>(`/videos/${id}`, { method: "DELETE" });
}

/**
 * Reorder videos within a gallery.
 */
export async function reorderVideos(
  galleryId: string,
  videoIds: string[]
): Promise<void> {
  return apiRequest<void>(`/galleries/${galleryId}/videos/reorder`, {
    method: "PUT",
    body: JSON.stringify({ videoIds }),
  });
}
