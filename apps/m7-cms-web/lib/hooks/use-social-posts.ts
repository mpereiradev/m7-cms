"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  listSocialPosts,
  createSocialPost,
  updateSocialPost,
  deleteSocialPost,
  reorderSocialPosts,
} from "@/lib/api/social-posts.api";
import type { SocialPostFormValues } from "@/lib/schemas/social-post.schema";

const SOCIAL_POSTS_KEY = ["social-posts"];

export function useSocialPosts() {
  return useQuery({
    queryKey: SOCIAL_POSTS_KEY,
    queryFn: listSocialPosts,
  });
}

export function useCreateSocialPost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SocialPostFormValues) => createSocialPost(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SOCIAL_POSTS_KEY });
      toast.success("Publicacao criada com sucesso");
    },
    onError: () => {
      toast.error("Erro ao criar publicacao");
    },
  });
}

export function useUpdateSocialPost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<SocialPostFormValues> }) =>
      updateSocialPost(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SOCIAL_POSTS_KEY });
      toast.success("Publicacao atualizada com sucesso");
    },
    onError: () => {
      toast.error("Erro ao atualizar publicacao");
    },
  });
}

export function useDeleteSocialPost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteSocialPost(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SOCIAL_POSTS_KEY });
      toast.success("Publicacao removida com sucesso");
    },
    onError: () => {
      toast.error("Erro ao remover publicacao");
    },
  });
}

export function useReorderSocialPosts() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderedIds: string[]) => reorderSocialPosts(orderedIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SOCIAL_POSTS_KEY });
    },
    onError: () => {
      toast.error("Erro ao reordenar publicacoes");
    },
  });
}
