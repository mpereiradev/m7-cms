"use client";

import { useRouter } from "next/navigation";
import { type ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Pencil, Trash2, Plus } from "lucide-react";
import { toast } from "sonner";

import type { PageListItem } from "@/lib/schemas/page.schema";
import { usePages, useDeletePage } from "@/lib/hooks/use-pages";
import { DataTable } from "@/components/shared/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";

function getTitle(page: PageListItem, lang = "pt-BR"): string {
  const t = page.translations.find((tr) => tr.languageCode === lang);
  return t?.title ?? page.translations[0]?.title ?? "Sem titulo";
}

export function PageListClient() {
  const router = useRouter();
  const { data, isLoading, error } = usePages();
  const deletePage = useDeletePage();

  const handleDelete = async (id: string) => {
    try {
      await deletePage.mutateAsync(id);
      toast.success("Pagina removida com sucesso!");
    } catch (err) {
      toast.error("Erro ao remover pagina", {
        description: err instanceof Error ? err.message : "Erro desconhecido",
      });
    }
  };

  const columns: ColumnDef<PageListItem>[] = [
    {
      accessorKey: "title",
      header: "Titulo",
      cell: ({ row }) => (
        <span className="font-medium">{getTitle(row.original)}</span>
      ),
      filterFn: (row, _columnId, value: string) => {
        const title = getTitle(row.original).toLowerCase();
        return title.includes(value.toLowerCase());
      },
    },
    {
      accessorKey: "isPublished",
      header: "Status",
      cell: ({ row }) => (
        <Badge variant={row.original.isPublished ? "default" : "secondary"}>
          {row.original.isPublished ? "Publicado" : "Rascunho"}
        </Badge>
      ),
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
            <DropdownMenuItem
              onClick={() => router.push(`/pages/${row.original.id}`)}
            >
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
        Erro ao carregar paginas: {error.message}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Paginas</h1>
          <p className="text-muted-foreground">
            Gerencie as paginas do seu site
          </p>
        </div>
        <Button onClick={() => router.push("/pages/new")}>
          <Plus className="mr-2 h-4 w-4" />
          Nova pagina
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
          searchColumn="title"
          searchPlaceholder="Buscar paginas..."
        />
      )}
    </div>
  );
}
