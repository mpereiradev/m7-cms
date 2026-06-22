"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createVideo,
  deleteVideo,
  getVideo,
  listVideos,
  reorderVideos,
  updateVideo,
} from "@/lib/api/videos.api";
import type { CreateVideoInput } from "@/types/media";

export function useVideos(params?: {
  galleryId?: string;
  page?: number;
  perPage?: number;
}) {
  return useQuery({
    queryKey: ["videos", params],
    queryFn: () => listVideos(params),
  });
}

export function useVideo(id: string, enabled = true) {
  return useQuery({
    queryKey: ["videos", id],
    queryFn: () => getVideo(id),
    enabled,
  });
}

export function useCreateVideo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateVideoInput) => createVideo(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["videos"] });
      queryClient.invalidateQueries({ queryKey: ["galleries"] });
    },
  });
}

export function useUpdateVideo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateVideoInput> }) =>
      updateVideo(id, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["videos", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["videos"] });
      queryClient.invalidateQueries({ queryKey: ["galleries"] });
    },
  });
}

export function useDeleteVideo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteVideo(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["videos"] });
      queryClient.invalidateQueries({ queryKey: ["galleries"] });
    },
  });
}

export function useReorderVideos() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      galleryId,
      videoIds,
    }: {
      galleryId: string;
      videoIds: string[];
    }) => reorderVideos(galleryId, videoIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["videos"] });
      queryClient.invalidateQueries({ queryKey: ["galleries"] });
    },
  });
}
