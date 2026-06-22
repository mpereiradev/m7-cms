import { z } from "zod";

export const postTranslationSchema = z.object({
  languageCode: z.string().min(1),
  title: z.string().min(1, "O titulo e obrigatorio"),
  slug: z.string().min(1, "O slug e obrigatorio"),
  excerpt: z.string().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
});

export const postFormSchema = z.object({
  status: z.enum(["draft", "published", "scheduled"]),
  publishedAt: z.string().optional(),
  coverImageUrl: z.string().optional(),
  categoryIds: z.array(z.string()),
  tagIds: z.array(z.string()),
  body: z.unknown().optional(),
  translations: z.object({
    "pt-BR": postTranslationSchema,
    en: postTranslationSchema.partial({ title: true, slug: true }),
  }),
});

export type PostFormValues = z.infer<typeof postFormSchema>;

export type PostTranslation = {
  id: string;
  languageCode: string;
  title: string;
  slug: string;
  excerpt: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
};

export type Post = {
  id: string;
  tenantId: string;
  authorId: string;
  status: "draft" | "published" | "scheduled";
  publishedAt: string | null;
  coverImageUrl: string | null;
  body: Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
  translations: PostTranslation[];
  categories: { id: string; name: string }[];
  tags: { id: string; name: string }[];
};

export type PostListItem = {
  id: string;
  status: "draft" | "published" | "scheduled";
  publishedAt: string | null;
  coverImageUrl: string | null;
  updatedAt: string;
  translations: PostTranslation[];
  categories: { id: string; name: string }[];
};
