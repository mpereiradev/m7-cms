"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  listUsers,
  inviteUser,
  updateRole,
  removeUser,
  createUserDirect,
  type InviteUserPayload,
  type UpdateRolePayload,
  type CreateUserDirectPayload,
} from "@/lib/api/users.api";

export function useUsers(params?: {
  page?: number;
  perPage?: number;
  search?: string;
}) {
  return useQuery({
    queryKey: ["users", params],
    queryFn: () => listUsers(params),
  });
}

export function useInviteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: InviteUserPayload) => inviteUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("Convite enviado com sucesso");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erro ao enviar convite");
    },
  });
}

export function useUpdateRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, data }: { userId: string; data: UpdateRolePayload }) =>
      updateRole(userId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("Papel atualizado com sucesso");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erro ao atualizar papel");
    },
  });
}

export function useRemoveUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => removeUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("Usuario removido com sucesso");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erro ao remover usuario");
    },
  });
}

export function useCreateUserDirect() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateUserDirectPayload) => createUserDirect(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("Usuario criado com sucesso");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erro ao criar usuario");
    },
  });
}
