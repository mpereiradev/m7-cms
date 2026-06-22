"use client";

import { useRouter } from "next/navigation";
import { useCreateBanner } from "@/lib/hooks/use-banners";
import { BannerForm } from "@/components/banners/banner-form";
import type { BannerFormValues } from "@/lib/schemas/banner.schema";

export default function NewBannerPage() {
  const router = useRouter();
  const createMutation = useCreateBanner();

  function handleSubmit(data: BannerFormValues) {
    createMutation.mutate(data, {
      onSuccess: () => router.push("/banners"),
    });
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Novo banner</h1>
        <p className="text-muted-foreground">
          Preencha as informacoes abaixo para criar um novo banner.
        </p>
      </div>

      <BannerForm
        onSubmit={handleSubmit}
        isLoading={createMutation.isPending}
        mode="create"
      />
    </div>
  );
}
