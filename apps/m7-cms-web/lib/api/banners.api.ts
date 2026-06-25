import { apiRequest } from "@/lib/api/client";
import type { Banner, BannerFormValues } from "@/lib/schemas/banner.schema";

export async function listBanners(): Promise<Banner[]> {
  const res = await apiRequest<{ data: Banner[] }>("/banners");
  return res.data;
}

export async function getBanner(id: string): Promise<Banner> {
  const res = await apiRequest<{ data: Banner }>(`/banners/${id}`);
  return res.data;
}

export async function createBanner(data: BannerFormValues): Promise<Banner> {
  const res = await apiRequest<{ data: Banner }>("/banners", {
    method: "POST",
    body: JSON.stringify(data),
  });
  return res.data;
}

export async function updateBanner(
  id: string,
  data: Partial<BannerFormValues>
): Promise<Banner> {
  const res = await apiRequest<{ data: Banner }>(`/banners/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
  return res.data;
}

export async function deleteBanner(id: string): Promise<void> {
  return apiRequest<void>(`/banners/${id}`, {
    method: "DELETE",
  });
}
