import { apiRequest } from "@/lib/api/client";
import type {
  AddGalleryItemInput,
  CreateGalleryInput,
  Gallery,
  GalleryDetail,
  PaginatedResponse,
} from "@/types/media";

/**
 * List all galleries, optionally filtered by type (image/video).
 */
export async function listGalleries(params?: {
  page?: number;
  perPage?: number;
  type?: "image" | "video";
}): Promise<PaginatedResponse<Gallery>> {
  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.set("page", String(params.page));
  if (params?.perPage) searchParams.set("perPage", String(params.perPage));
  if (params?.type) searchParams.set("type", params.type);

  const query = searchParams.toString();
  return apiRequest<PaginatedResponse<Gallery>>(
    `/galleries${query ? `?${query}` : ""}`
  );
}

/**
 * Get a single gallery with its items.
 */
export async function getGallery(id: string): Promise<GalleryDetail> {
  return apiRequest<GalleryDetail>(`/galleries/${id}`);
}

/**
 * Create a new gallery.
 */
export async function createGallery(
  data: CreateGalleryInput
): Promise<Gallery> {
  return apiRequest<Gallery>("/galleries", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/**
 * Update a gallery's metadata.
 */
export async function updateGallery(
  id: string,
  data: Partial<CreateGalleryInput>
): Promise<Gallery> {
  return apiRequest<Gallery>(`/galleries/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

/**
 * Delete a gallery.
 */
export async function deleteGallery(id: string): Promise<void> {
  return apiRequest<void>(`/galleries/${id}`, { method: "DELETE" });
}

/**
 * Add an item to a gallery.
 */
export async function addGalleryItem(
  galleryId: string,
  data: AddGalleryItemInput
): Promise<void> {
  return apiRequest<void>(`/galleries/${galleryId}/items`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/**
 * Reorder items in a gallery.
 */
export async function reorderGalleryItems(
  galleryId: string,
  itemIds: string[]
): Promise<void> {
  return apiRequest<void>(`/galleries/${galleryId}/items/reorder`, {
    method: "PUT",
    body: JSON.stringify({ itemIds }),
  });
}

/**
 * Delete an item from a gallery.
 */
export async function deleteGalleryItem(
  galleryId: string,
  itemId: string
): Promise<void> {
  return apiRequest<void>(`/galleries/${galleryId}/items/${itemId}`, {
    method: "DELETE",
  });
}
