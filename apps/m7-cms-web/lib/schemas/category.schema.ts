import { z } from "zod";

export const categoryTranslationSchema = z.object({
  languageCode: z.string().min(1),
  name: z.string().min(1, "O nome e obrigatorio"),
  description: z.string(),
});

export const categoryFormSchema = z.object({
  slug: z.string().min(1, "O slug e obrigatorio"),
  parentId: z.string().nullable(),
  order: z.number().int(),
  translations: z.object({
    "pt-BR": categoryTranslationSchema,
    en: categoryTranslationSchema.partial(),
  }),
});

export type CategoryFormValues = z.infer<typeof categoryFormSchema>;

export type CategoryTranslation = {
  id: string;
  languageCode: string;
  name: string;
  description: string | null;
};

export type Category = {
  id: string;
  tenantId: string;
  parentId: string | null;
  slug: string;
  order: number;
  createdAt: string;
  updatedAt: string;
  translations: CategoryTranslation[];
};

export type CategoryTreeNode = Category & {
  children: CategoryTreeNode[];
};

export function buildCategoryTree(
  categories: Category[],
  maxDepth = 3
): CategoryTreeNode[] {
  const map = new Map<string, CategoryTreeNode>();
  const roots: CategoryTreeNode[] = [];

  for (const cat of categories) {
    map.set(cat.id, { ...cat, children: [] });
  }

  for (const node of map.values()) {
    if (node.parentId && map.has(node.parentId)) {
      map.get(node.parentId)!.children.push(node);
    } else {
      roots.push(node);
    }
  }

  function prune(nodes: CategoryTreeNode[], depth: number): CategoryTreeNode[] {
    if (depth >= maxDepth) {
      return nodes.map((n) => ({ ...n, children: [] }));
    }
    return nodes.map((n) => ({
      ...n,
      children: prune(n.children, depth + 1),
    }));
  }

  return prune(
    roots.sort((a, b) => a.order - b.order),
    0
  );
}

export function getCategoryName(category: Category, lang = "pt-BR"): string {
  const t = category.translations.find((tr) => tr.languageCode === lang);
  return t?.name ?? category.translations[0]?.name ?? "Sem nome";
}

export function flattenTree(
  nodes: CategoryTreeNode[],
  depth = 0
): { node: CategoryTreeNode; depth: number }[] {
  const result: { node: CategoryTreeNode; depth: number }[] = [];
  for (const node of nodes) {
    result.push({ node, depth });
    result.push(...flattenTree(node.children, depth + 1));
  }
  return result;
}
