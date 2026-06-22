"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  listPages,
  getPage,
  createPage,
  updatePage,
  deletePage,
  type ListPagesParams,
} from "@/lib/api/pages.api";

export function usePages(params?: ListPagesParams) {
  return useQuery({
    queryKey: ["pages", params],
    queryFn: () => listPages(params),
  });
}

export function usePage(id: string | undefined) {
  return useQuery({
    queryKey: ["pages", id],
    queryFn: () => getPage(id!),
    enabled: !!id,
  });
}

export function useCreatePage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Record<string, unknown>) => createPage(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pages"] });
    },
  });
}

export function useUpdatePage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) =>
      updatePage(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pages"] });
    },
  });
}

export function useDeletePage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deletePage(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pages"] });
    },
  });
}
