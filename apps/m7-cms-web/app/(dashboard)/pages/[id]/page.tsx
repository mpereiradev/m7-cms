"use client";

import { use } from "react";
import { usePage } from "@/lib/hooks/use-pages";
import { PageForm } from "@/components/pages/page-form";
import { Skeleton } from "@/components/ui/skeleton";

export default function EditPagePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data, isLoading, error } = usePage(id);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-md border border-destructive/50 bg-destructive/10 p-4 text-destructive">
        Erro ao carregar pagina: {error.message}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Editar pagina</h1>
        <p className="text-muted-foreground">
          Atualize os dados da pagina
        </p>
      </div>
      <PageForm page={data?.data} />
    </div>
  );
}
