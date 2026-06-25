"use client";

import { use } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { StoreForm } from "@/components/stores/store-form";
import { StoreHoursManager } from "@/components/stores/store-hours-manager";
import { useStore } from "@/lib/hooks/use-stores";

export default function EditStorePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: store, isLoading } = useStore(id);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-[200px]" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!store) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Loja nao encontrada.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Editar Loja</h1>
        <p className="text-muted-foreground">
          {store.translations[0]?.name ?? store.slug}
        </p>
      </div>
      <StoreForm store={store} />
      <StoreHoursManager storeId={store.id} hours={store.hours} />
    </div>
  );
}
