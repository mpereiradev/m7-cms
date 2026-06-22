"use client";

import { useState } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Pencil, Trash2, Plus } from "lucide-react";
import { toast } from "sonner";

import type { Category } from "@/lib/schemas/category.schema";
import { useCategories, useDeleteCategory } from "@/lib/hooks/use-categories";
import { CategoryForm } from "@/components/categories/category-form";
import { DataTable } from "@/components/shared/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function getCategoryName(category: Category, lang = "pt-BR"): string {
  const t = category.translations.find((tr) => tr.languageCode === lang);
  return t?.name ?? category.translations[0]?.name ?? "Sem nome";
}

export default function CategoriesPage() {
  const [formOpen, setFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | undefined>();
  const { data, isLoading, error } = useCategories();
  const deleteCategory = useDeleteCategory();

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

  const columns: ColumnDef<Category>[] = [
    {
      accessorKey: "name",
      header: "Nome",
      cell: ({ row }) => (
        <span className="font-medium">{getCategoryName(row.original)}</span>
      ),
      filterFn: (row, _columnId, value: string) => {
        const name = getCategoryName(row.original).toLowerCase();
        return name.includes(value.toLowerCase());
      },
    },
    {
      accessorKey: "translations",
      header: "Idiomas",
      cell: ({ row }) => (
        <div className="flex gap-1">
          {row.original.translations.map((t) => (
            <Badge key={t.languageCode} variant="outline" className="text-xs">
              {t.languageCode}
            </Badge>
          ))}
        </div>
      ),
    },
    {
      accessorKey: "displayOrder",
      header: "Ordem",
    },
    {
      accessorKey: "updatedAt",
      header: "Atualizado",
      cell: ({ row }) =>
        new Date(row.original.updatedAt).toLocaleDateString("pt-BR"),
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Abrir menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleEdit(row.original)}>
              <Pencil className="mr-2 h-4 w-4" />
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive"
              onClick={() => handleDelete(row.original.id)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Remover
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

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
            Gerencie as categorias dos posts
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
      ) : (
        <DataTable
          columns={columns}
          data={data?.data ?? []}
          searchColumn="name"
          searchPlaceholder="Buscar categorias..."
        />
      )}

      <CategoryForm
        category={editingCategory}
        open={formOpen}
        onOpenChange={setFormOpen}
      />
    </div>
  );
}
