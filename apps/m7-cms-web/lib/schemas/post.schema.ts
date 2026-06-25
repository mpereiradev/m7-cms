import { z } from "zod";

export const postTranslationSchema = z.object({
  languageCode: z.string().min(1),
  title: z.string().min(1, "O titulo e obrigatorio"),
  summary: z.string(),
  content: z.unknown().optional(),
  seoTitle: z.string(),
  seoDescription: z.string(),
});

export const postFormSchema = z.object({
  slug: z.string().min(1, "O slug e obrigatorio"),
  status: z.enum(["draft", "published"]),
  publishedAt: z.string(),
  coverMediaId: z.string(),
  coverImageUrl: z.string(),
  categoryIds: z.array(z.string()),
  tagIds: z.array(z.string()),
  translations: z.object({
    "pt-BR": postTranslationSchema,
    en: postTranslationSchema.partial(),
  }),
});

export type PostFormValues = z.infer<typeof postFormSchema>;

export type PostTranslation = {
  id: string;
  languageCode: string;
  title: string;
  summary: string | null;
  content: unknown;
  seoTitle: string | null;
  seoDescription: string | null;
};

export type Post = {
  id: string;
  tenantId: string;
  slug: string;
  authorId: string | null;
  status: "draft" | "published";
  publishedAt: string | null;
  coverMediaId: string | null;
  createdAt: string;
  updatedAt: string;
  translations: PostTranslation[];
  categoryIds: string[];
  tagIds: string[];
};

export type PostListItem = {
  id: string;
  slug: string;
  status: "draft" | "published";
  publishedAt: string | null;
  coverMediaId: string | null;
  updatedAt: string;
  translations: PostTranslation[];
  categoryIds: string[];
  tagIds: string[];
};
