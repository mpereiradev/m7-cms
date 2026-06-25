"use client";

import { useRouter } from "next/navigation";
import { type ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Pencil, Trash2, Plus, Send } from "lucide-react";
import { toast } from "sonner";

import type { PostListItem } from "@/lib/schemas/post.schema";
import { usePosts, useDeletePost, usePublishPost } from "@/lib/hooks/use-posts";
import { DataTable } from "@/components/shared/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";

const STATUS_MAP = {
  draft: { label: "Rascunho", variant: "secondary" as const },
  published: { label: "Publicado", variant: "default" as const },
  scheduled: { label: "Agendado", variant: "outline" as const },
};

function getTitle(post: PostListItem, lang = "pt-BR"): string {
  const t = post.translations.find((tr) => tr.languageCode === lang);
  return t?.title ?? post.translations[0]?.title ?? "Sem titulo";
}

export function PostListClient() {
  const router = useRouter();
  const { data, isLoading, error } = usePosts();
  const deletePost = useDeletePost();
  const publishPost = usePublishPost();

  const handleDelete = async (id: string) => {
    try {
      await deletePost.mutateAsync(id);
      toast.success("Post removido com sucesso!");
    } catch (err) {
      toast.error("Erro ao remover post", {
        description: err instanceof Error ? err.message : "Erro desconhecido",
      });
    }
  };

  const handlePublish = async (id: string) => {
    try {
      await publishPost.mutateAsync(id);
      toast.success("Post publicado com sucesso!");
    } catch (err) {
      toast.error("Erro ao publicar post", {
        description: err instanceof Error ? err.message : "Erro desconhecido",
      });
    }
  };

  const columns: ColumnDef<PostListItem>[] = [
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
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = STATUS_MAP[row.original.status];
        return <Badge variant={status.variant}>{status.label}</Badge>;
      },
    },
    {
      accessorKey: "categoryIds",
      header: "Categorias",
      cell: ({ row }) => (
        <div className="flex flex-wrap gap-1">
          {row.original.categoryIds.length > 0 ? (
            <Badge variant="outline" className="text-xs">
              {row.original.categoryIds.length} categoria(s)
            </Badge>
          ) : (
            <span className="text-xs text-muted-foreground">--</span>
          )}
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
              onClick={() => router.push(`/posts/${row.original.id}`)}
            >
              <Pencil className="mr-2 h-4 w-4" />
              Editar
            </DropdownMenuItem>
            {row.original.status === "draft" && (
              <DropdownMenuItem
                onClick={() => handlePublish(row.original.id)}
              >
                <Send className="mr-2 h-4 w-4" />
                Publicar
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
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
        Erro ao carregar posts: {error.message}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Posts</h1>
          <p className="text-muted-foreground">
            Gerencie os posts do blog
          </p>
        </div>
        <Button onClick={() => router.push("/posts/new")}>
          <Plus className="mr-2 h-4 w-4" />
          Novo post
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
          searchPlaceholder="Buscar posts..."
        />
      )}
    </div>
  );
}
