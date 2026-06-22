import { z } from "zod";

export const bannerSchema = z
  .object({
    title: z.string().min(1, "O titulo e obrigatorio"),
    imageUrl: z.string().min(1, "A imagem e obrigatoria").url("Informe uma URL valida"),
    ctaLabel: z.string(),
    ctaUrl: z.string(),
    pageTarget: z.string(),
    isActive: z.boolean(),
    startsAt: z.string(),
    endsAt: z.string(),
  })
  .refine(
    (data) => {
      if (data.startsAt && data.endsAt) {
        return new Date(data.startsAt) <= new Date(data.endsAt);
      }
      return true;
    },
    {
      message: "A data de inicio deve ser anterior a data de termino",
      path: ["endsAt"],
    }
  );

export type BannerFormValues = z.infer<typeof bannerSchema>;

export type BannerStatus = "active" | "scheduled" | "expired" | "inactive";

export type Banner = {
  id: string;
  tenantId: string;
  title: string;
  imageUrl: string;
  ctaLabel: string | null;
  ctaUrl: string | null;
  pageTarget: string;
  isActive: boolean;
  startsAt: string | null;
  endsAt: string | null;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

/**
 * Derive display status from banner data.
 */
export function getBannerStatus(banner: Banner): BannerStatus {
  if (!banner.isActive) return "inactive";

  const now = new Date();

  if (banner.startsAt && new Date(banner.startsAt) > now) return "scheduled";
  if (banner.endsAt && new Date(banner.endsAt) < now) return "expired";

  return "active";
}
