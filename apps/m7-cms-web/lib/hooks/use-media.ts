"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteMedia,
  getSignedUrl,
  listMedia,
  uploadMedia,
} from "@/lib/api/media.api";
import type { MediaListParams } from "@/types/media";

export function useMedia(params?: MediaListParams) {
  return useQuery({
    queryKey: ["media", params],
    queryFn: () => listMedia(params),
  });
}

export function useUploadMedia() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      file,
      onProgress,
    }: {
      file: File;
      onProgress?: (percent: number) => void;
    }) => uploadMedia(file, onProgress),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["media"] });
    },
  });
}

export function useDeleteMedia() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteMedia(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["media"] });
    },
  });
}

export function useSignedUrl(id: string, enabled = true) {
  return useQuery({
    queryKey: ["media", "signed-url", id],
    queryFn: () => getSignedUrl(id),
    enabled,
  });
}
