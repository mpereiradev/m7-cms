"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  listTags,
  createTag,
  deleteTag,
  type ListTagsParams,
} from "@/lib/api/tags.api";

export function useTags(params?: ListTagsParams) {
  return useQuery({
    queryKey: ["tags", params],
    queryFn: () => listTags(params),
  });
}

export function useCreateTag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { name: string; slug: string }) => createTag(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tags"] });
    },
  });
}

export function useDeleteTag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteTag(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tags"] });
    },
  });
}
