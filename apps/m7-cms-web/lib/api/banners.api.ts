import { apiRequest } from "@/lib/api/client";
import type { Banner, BannerFormValues } from "@/lib/schemas/banner.schema";

/**
 * Fetch all banners for the current tenant.
 */
export async function listBanners(): Promise<Banner[]> {
  return apiRequest<Banner[]>("/banners");
}

/**
 * Fetch a single banner by ID.
 */
export async function getBanner(id: string): Promise<Banner> {
  return apiRequest<Banner>(`/banners/${id}`);
}

/**
 * Create a new banner.
 */
export async function createBanner(data: BannerFormValues): Promise<Banner> {
  return apiRequest<Banner>("/banners", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/**
 * Update an existing banner.
 */
export async function updateBanner(
  id: string,
  data: Partial<BannerFormValues>
): Promise<Banner> {
  return apiRequest<Banner>(`/banners/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

/**
 * Delete a banner.
 */
export async function deleteBanner(id: string): Promise<void> {
  return apiRequest<void>(`/banners/${id}`, {
    method: "DELETE",
  });
}
