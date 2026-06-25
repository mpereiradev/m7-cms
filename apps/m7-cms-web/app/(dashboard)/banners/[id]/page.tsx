"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { useBanner, useUpdateBanner } from "@/lib/hooks/use-banners";
import { BannerForm } from "@/components/banners/banner-form";
import type { BannerFormValues } from "@/lib/schemas/banner.schema";

export default function EditBannerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { data: banner, isLoading } = useBanner(id);
  const updateMutation = useUpdateBanner();

  function handleSubmit(data: BannerFormValues) {
    updateMutation.mutate(
      { id, data },
      { onSuccess: () => router.push("/banners") }
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-64" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!banner) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Banner nao encontrado.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Editar banner</h1>
        <p className="text-muted-foreground">
          Altere as informacoes do banner abaixo.
        </p>
      </div>

      <BannerForm
        onSubmit={handleSubmit}
        defaultValues={{
          title: banner.title ?? "",
          mediaId: banner.mediaId ?? "",
          ctaLabel: banner.ctaLabel ?? "",
          linkUrl: banner.linkUrl ?? "",
          displayStart: banner.displayStart ?? "",
          displayEnd: banner.displayEnd ?? "",
          order: banner.order,
        }}
        isLoading={updateMutation.isPending}
        mode="edit"
      />
    </div>
  );
}
