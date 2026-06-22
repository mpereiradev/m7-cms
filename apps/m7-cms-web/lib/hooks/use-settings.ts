"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getSettings,
  batchUpdateSettings,
  type BatchUpdatePayload,
} from "@/lib/api/settings.api";

export function useSettings() {
  return useQuery({
    queryKey: ["settings"],
    queryFn: () => getSettings(),
  });
}

export function useBatchUpdateSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: BatchUpdatePayload) => batchUpdateSettings(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings"] });
      toast.success("Configuracoes salvas com sucesso");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erro ao salvar configuracoes");
    },
  });
}
