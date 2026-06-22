"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  listBanners,
  getBanner,
  createBanner,
  updateBanner,
  deleteBanner,
} from "@/lib/api/banners.api";
import type { BannerFormValues } from "@/lib/schemas/banner.schema";

const BANNERS_KEY = ["banners"];

export function useBanners() {
  return useQuery({
    queryKey: BANNERS_KEY,
    queryFn: listBanners,
  });
}

export function useBanner(id: string) {
  return useQuery({
    queryKey: [...BANNERS_KEY, id],
    queryFn: () => getBanner(id),
    enabled: !!id,
  });
}

export function useCreateBanner() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: BannerFormValues) => createBanner(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BANNERS_KEY });
      toast.success("Banner criado com sucesso");
    },
    onError: () => {
      toast.error("Erro ao criar banner");
    },
  });
}

export function useUpdateBanner() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<BannerFormValues> }) =>
      updateBanner(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BANNERS_KEY });
      toast.success("Banner atualizado com sucesso");
    },
    onError: () => {
      toast.error("Erro ao atualizar banner");
    },
  });
}

export function useDeleteBanner() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteBanner(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BANNERS_KEY });
      toast.success("Banner removido com sucesso");
    },
    onError: () => {
      toast.error("Erro ao remover banner");
    },
  });
}
