import { z } from "zod";

export const storeTranslationSchema = z.object({
  languageCode: z.string().min(1),
  name: z.string().min(1, "O nome e obrigatorio"),
  address: z.string(),
  description: z.string(),
});

export const storeFormSchema = z.object({
  slug: z.string().min(1, "O slug e obrigatorio"),
  mapUrl: z.string(),
  email: z.string(),
  phone: z.string(),
  whatsapp: z.string(),
  translations: z.object({
    "pt-BR": storeTranslationSchema,
    en: storeTranslationSchema.partial(),
  }),
});

export type StoreFormValues = z.infer<typeof storeFormSchema>;

export const storeHourSchema = z.object({
  weekday: z.number().min(0).max(6),
  openTime: z.string().regex(/^\d{2}:\d{2}$/, "Formato HH:mm"),
  closeTime: z.string().regex(/^\d{2}:\d{2}$/, "Formato HH:mm"),
});

export const storeHoursFormSchema = z.object({
  hours: z.array(storeHourSchema),
});

export type StoreHoursFormValues = z.infer<typeof storeHoursFormSchema>;
