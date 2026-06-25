import { z } from "zod";

export const bannerSchema = z
  .object({
    title: z.string().min(1, "O titulo e obrigatorio"),
    mediaId: z.string(),
    ctaLabel: z.string(),
    linkUrl: z.string(),
    displayStart: z.string().min(1, "A data de inicio e obrigatoria"),
    displayEnd: z.string(),
    order: z.number().int().min(0),
  })
  .refine(
    (data) => {
      if (data.displayStart && data.displayEnd) {
        return new Date(data.displayStart) <= new Date(data.displayEnd);
      }
      return true;
    },
    {
      message: "A data de inicio deve ser anterior a data de termino",
      path: ["displayEnd"],
    }
  );

export type BannerFormValues = z.infer<typeof bannerSchema>;

export type BannerStatus = "active" | "scheduled" | "expired";

export type Banner = {
  id: string;
  tenantId: string;
  title: string | null;
  mediaId: string | null;
  ctaLabel: string | null;
  linkUrl: string | null;
  displayStart: string | null;
  displayEnd: string | null;
  order: number;
  createdAt: string;
  updatedAt: string;
};

export function getBannerStatus(banner: Banner): BannerStatus {
  const now = new Date();
  if (banner.displayStart && new Date(banner.displayStart) > now) return "scheduled";
  if (banner.displayEnd && new Date(banner.displayEnd) < now) return "expired";
  return "active";
}
