"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  listTenants,
  createTenant,
  updateTenant,
  type CreateTenantPayload,
  type UpdateTenantPayload,
} from "@/lib/api/tenants.api";

export function useTenants(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ["tenants"],
    queryFn: () => listTenants(),
    enabled: options?.enabled !== false,
  });
}

export function useCreateTenant() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateTenantPayload) => createTenant(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tenants"] });
      toast.success("Site criado com sucesso");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erro ao criar site");
    },
  });
}

export function useUpdateTenant() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTenantPayload }) =>
      updateTenant(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tenants"] });
      toast.success("Site atualizado com sucesso");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erro ao atualizar site");
    },
  });
}
