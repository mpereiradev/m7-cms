import { z } from "zod";

export const SOCIAL_PLATFORMS = [
  "instagram",
  "facebook",
  "tiktok",
  "x",
  "linkedin",
  "youtube",
  "pinterest",
  "unknown",
] as const;

export type SocialPlatform = (typeof SOCIAL_PLATFORMS)[number];

/**
 * Detect social media platform from URL.
 */
export function detectPlatform(url: string): SocialPlatform {
  if (/instagram\.com/.test(url)) return "instagram";
  if (/facebook\.com|fb\.com/.test(url)) return "facebook";
  if (/tiktok\.com/.test(url)) return "tiktok";
  if (/twitter\.com|x\.com/.test(url)) return "x";
  if (/linkedin\.com/.test(url)) return "linkedin";
  if (/youtube\.com|youtu\.be/.test(url)) return "youtube";
  if (/pinterest\.com/.test(url)) return "pinterest";
  return "unknown";
}

export const socialPostSchema = z.object({
  url: z.string().min(1, "A URL e obrigatoria").url("Informe uma URL valida"),
  platform: z.enum(SOCIAL_PLATFORMS).optional(),
  isActive: z.boolean(),
});

export type SocialPostFormValues = z.infer<typeof socialPostSchema>;

export type SocialPost = {
  id: string;
  tenantId: string;
  url: string;
  platform: SocialPlatform;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};
