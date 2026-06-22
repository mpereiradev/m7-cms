import { z } from "zod";

export const pageTranslationSchema = z.object({
  languageCode: z.string().min(1),
  title: z.string().min(1, "O titulo e obrigatorio"),
  slug: z.string().min(1, "O slug e obrigatorio"),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
});

export const pageFormSchema = z.object({
  isPublished: z.boolean(),
  publishedAt: z.string().optional(),
  translations: z.object({
    "pt-BR": pageTranslationSchema,
    en: pageTranslationSchema.partial({ title: true, slug: true }),
  }),
});

export type PageFormValues = z.infer<typeof pageFormSchema>;

export type PageTranslation = {
  id: string;
  languageCode: string;
  title: string;
  slug: string;
  metaTitle: string | null;
  metaDescription: string | null;
};

export type PageSection = {
  id: string;
  sectionType: string;
  displayOrder: number;
  content: Record<string, unknown>;
};

export type Page = {
  id: string;
  tenantId: string;
  isPublished: boolean;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  translations: PageTranslation[];
  sections: PageSection[];
};

export type PageListItem = {
  id: string;
  isPublished: boolean;
  publishedAt: string | null;
  updatedAt: string;
  translations: PageTranslation[];
};
