"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  listStores,
  getStore,
  createStore,
  updateStore,
  deleteStore,
  setStoreHours,
  type CreateStorePayload,
  type UpdateStorePayload,
  type SetStoreHoursPayload,
} from "@/lib/api/stores.api";

export function useStores(params?: {
  page?: number;
  perPage?: number;
  search?: string;
}) {
  return useQuery({
    queryKey: ["stores", params],
    queryFn: () => listStores(params),
  });
}

export function useStore(id: string | undefined) {
  return useQuery({
    queryKey: ["stores", id],
    queryFn: () => getStore(id!),
    enabled: !!id,
  });
}

export function useCreateStore() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateStorePayload) => createStore(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stores"] });
      toast.success("Loja criada com sucesso");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erro ao criar loja");
    },
  });
}

export function useUpdateStore() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateStorePayload }) =>
      updateStore(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stores"] });
      toast.success("Loja atualizada com sucesso");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erro ao atualizar loja");
    },
  });
}

export function useDeleteStore() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteStore(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stores"] });
      toast.success("Loja removida com sucesso");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erro ao remover loja");
    },
  });
}

export function useSetStoreHours() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: SetStoreHoursPayload }) =>
      setStoreHours(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stores"] });
      toast.success("Horarios atualizados com sucesso");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erro ao atualizar horarios");
    },
  });
}
