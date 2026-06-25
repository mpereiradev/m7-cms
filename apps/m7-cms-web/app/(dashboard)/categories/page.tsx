"use client";

import { useState } from "react";
import { MoreHorizontal, Pencil, Trash2, Plus, ChevronRight, ChevronDown } from "lucide-react";
import { toast } from "sonner";

import {
  type Category,
  type CategoryTreeNode,
  getCategoryName,
  buildCategoryTree,
} from "@/lib/schemas/category.schema";
import { useCategories, useDeleteCategory } from "@/lib/hooks/use-categories";
import { CategoryForm } from "@/components/categories/category-form";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function CategoryRow({
  node,
  depth,
  onEdit,
  onDelete,
  expandedIds,
  toggleExpand,
}: {
  node: CategoryTreeNode;
  depth: number;
  onEdit: (cat: Category) => void;
  onDelete: (id: string) => void;
  expandedIds: Set<string>;
  toggleExpand: (id: string) => void;
}) {
  const hasChildren = node.children.length > 0;
  const isExpanded = expandedIds.has(node.id);

  return (
    <>
      <div
        className="flex items-center gap-2 px-4 py-2.5 border-b last:border-b-0 hover:bg-muted/50 transition-colors"
        style={{ paddingLeft: `${depth * 24 + 16}px` }}
      >
        {hasChildren ? (
          <button
            type="button"
            onClick={() => toggleExpand(node.id)}
            className="p-0.5 rounded hover:bg-muted"
          >
            {isExpanded ? (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            )}
          </button>
        ) : (
          <span className="w-5" />
        )}

        <span className="font-medium flex-1">{getCategoryName(node)}</span>

        <div className="flex items-center gap-2">
          {node.translations.length > 0 && (
            <div className="flex gap-1">
              {node.translations.map((t) => (
                <Badge key={t.languageCode} variant="outline" className="text-xs">
                  {t.languageCode}
                </Badge>
              ))}
            </div>
          )}

          <span className="text-xs text-muted-foreground w-20 text-right">
            {node.slug}
          </span>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(node)}>
                <Pencil className="mr-2 h-4 w-4" />
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive"
                onClick={() => onDelete(node.id)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Remover
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {hasChildren && isExpanded &&
        node.children
          .sort((a, b) => a.order - b.order)
          .map((child) => (
            <CategoryRow
              key={child.id}
              node={child}
              depth={depth + 1}
              onEdit={onEdit}
              onDelete={onDelete}
              expandedIds={expandedIds}
              toggleExpand={toggleExpand}
            />
          ))}
    </>
  );
}

export default function CategoriesPage() {
  const [formOpen, setFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | undefined>();
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const { data: categories, isLoading, error } = useCategories();
  const deleteCategory = useDeleteCategory();

  const tree = buildCategoryTree(categories ?? [], 3);

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormOpen(true);
  };

  const handleCreate = () => {
    setEditingCategory(undefined);
    setFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteCategory.mutateAsync(id);
      toast.success("Categoria removida com sucesso!");
    } catch (err) {
      toast.error("Erro ao remover categoria", {
        description: err instanceof Error ? err.message : "Erro desconhecido",
      });
    }
  };

  if (error) {
    return (
      <div className="rounded-md border border-destructive/50 bg-destructive/10 p-4 text-destructive">
        Erro ao carregar categorias: {error.message}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Categorias</h1>
          <p className="text-muted-foreground">
            Gerencie as categorias dos posts (ate 3 niveis)
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Nova categoria
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      ) : tree.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-4">
              Nenhuma categoria cadastrada.
            </p>
            <Button variant="outline" onClick={handleCreate}>
              <Plus className="mr-2 h-4 w-4" />
              Criar primeira categoria
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <div className="px-4 py-2 border-b bg-muted/30 text-xs font-medium text-muted-foreground flex items-center gap-2">
            <span className="w-5" />
            <span className="flex-1">Nome</span>
            <span className="w-20 text-right">Slug</span>
            <span className="w-8" />
          </div>
          {tree.map((node) => (
            <CategoryRow
              key={node.id}
              node={node}
              depth={0}
              onEdit={handleEdit}
              onDelete={handleDelete}
              expandedIds={expandedIds}
              toggleExpand={toggleExpand}
            />
          ))}
        </Card>
      )}

      <CategoryForm
        category={editingCategory}
        open={formOpen}
        onOpenChange={setFormOpen}
      />
    </div>
  );
}
