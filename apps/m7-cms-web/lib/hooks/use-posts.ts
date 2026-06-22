"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  listPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  publishPost,
  type ListPostsParams,
} from "@/lib/api/posts.api";

export function usePosts(params?: ListPostsParams) {
  return useQuery({
    queryKey: ["posts", params],
    queryFn: () => listPosts(params),
  });
}

export function usePost(id: string | undefined) {
  return useQuery({
    queryKey: ["posts", id],
    queryFn: () => getPost(id!),
    enabled: !!id,
  });
}

export function useCreatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Record<string, unknown>) => createPost(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
}

export function useUpdatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) =>
      updatePost(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
}

export function useDeletePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deletePost(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
}

export function usePublishPost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => publishPost(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
}
