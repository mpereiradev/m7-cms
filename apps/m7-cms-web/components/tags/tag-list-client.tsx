"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { type ColumnDef } from "@tanstack/react-table";
import { Trash2, Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { useTags, useCreateTag, useDeleteTag } from "@/lib/hooks/use-tags";
import { DataTable } from "@/components/shared/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import type { Tag } from "@/lib/api/tags.api";

const tagFormSchema = z.object({
  name: z.string().min(1, "O nome e obrigatorio"),
  slug: z.string().min(1, "O slug e obrigatorio"),
});

type TagFormValues = z.infer<typeof tagFormSchema>;

export function TagListClient() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { data, isLoading, error } = useTags();
  const createTag = useCreateTag();
  const deleteTag = useDeleteTag();

  const form = useForm<TagFormValues>({
    resolver: zodResolver(tagFormSchema),
    defaultValues: { name: "", slug: "" },
  });

  const handleDelete = async (id: string) => {
    try {
      await deleteTag.mutateAsync(id);
      toast.success("Tag removida com sucesso!");
    } catch (err) {
      toast.error("Erro ao remover tag", {
        description: err instanceof Error ? err.message : "Erro desconhecido",
      });
    }
  };

  async function onSubmit(values: TagFormValues) {
    try {
      await createTag.mutateAsync(values);
      toast.success("Tag criada com sucesso!");
      form.reset();
      setDialogOpen(false);
    } catch (err) {
      toast.error("Erro ao criar tag", {
        description: err instanceof Error ? err.message : "Erro desconhecido",
      });
    }
  }

  const columns: ColumnDef<Tag>[] = [
    {
      accessorKey: "name",
      header: "Nome",
      cell: ({ row }) => (
        <Badge variant="secondary">{row.original.name}</Badge>
      ),
    },
    {
      accessorKey: "slug",
      header: "Slug",
    },
    {
      accessorKey: "createdAt",
      header: "Criada em",
      cell: ({ row }) =>
        new Date(row.original.createdAt).toLocaleDateString("pt-BR"),
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-destructive hover:text-destructive"
          onClick={() => handleDelete(row.original.id)}
        >
          <Trash2 className="h-4 w-4" />
          <span className="sr-only">Remover tag</span>
        </Button>
      ),
    },
  ];

  if (error) {
    return (
      <div className="rounded-md border border-destructive/50 bg-destructive/10 p-4 text-destructive">
        Erro ao carregar tags: {error.message}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Tags</h1>
          <p className="text-muted-foreground">
            Gerencie as tags dos posts
          </p>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nova tag
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle>Nova tag</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome</FormLabel>
                      <FormControl>
                        <Input placeholder="Nome da tag" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Slug</FormLabel>
                      <FormControl>
                        <Input placeholder="nome-da-tag" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setDialogOpen(false)}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={createTag.isPending}>
                    {createTag.isPending && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Criar
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
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
          searchPlaceholder="Buscar tags..."
        />
      )}
    </div>
  );
}
