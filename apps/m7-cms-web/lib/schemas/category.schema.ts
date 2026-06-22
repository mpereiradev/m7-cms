import { z } from "zod";

export const categoryTranslationSchema = z.object({
  languageCode: z.string().min(1),
  name: z.string().min(1, "O nome e obrigatorio"),
  slug: z.string().min(1, "O slug e obrigatorio"),
});

export const categoryFormSchema = z.object({
  parentId: z.string().nullable(),
  displayOrder: z.number().int(),
  translations: z.object({
    "pt-BR": categoryTranslationSchema,
    en: categoryTranslationSchema.partial({ name: true, slug: true }),
  }),
});

export type CategoryFormValues = z.infer<typeof categoryFormSchema>;

export type CategoryTranslation = {
  id: string;
  languageCode: string;
  name: string;
  slug: string;
};

export type Category = {
  id: string;
  tenantId: string;
  parentId: string | null;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
  translations: CategoryTranslation[];
  children?: Category[];
};
