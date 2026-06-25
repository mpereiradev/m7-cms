import { z } from "zod";

export const pageTranslationSchema = z.object({
  languageCode: z.string().min(1),
  title: z.string().min(1, "O titulo e obrigatorio"),
  seoTitle: z.string(),
  seoDescription: z.string(),
});

export const pageFormSchema = z.object({
  slug: z.string().min(1, "O slug e obrigatorio"),
  translations: z.object({
    "pt-BR": pageTranslationSchema,
    en: pageTranslationSchema.partial(),
  }),
});

export type PageFormValues = z.infer<typeof pageFormSchema>;

export type PageTranslation = {
  id: string;
  languageCode: string;
  title: string;
  seoTitle: string | null;
  seoDescription: string | null;
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
  slug: string;
  status: "draft" | "published";
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  translations: PageTranslation[];
  sections: PageSection[];
};

export type PageListItem = {
  id: string;
  slug: string;
  status: "draft" | "published";
  publishedAt: string | null;
  updatedAt: string;
  translations: PageTranslation[];
};
