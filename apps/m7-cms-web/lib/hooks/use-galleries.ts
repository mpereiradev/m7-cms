"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addGalleryItem,
  createGallery,
  deleteGallery,
  deleteGalleryItem,
  getGallery,
  listGalleries,
  reorderGalleryItems,
  updateGallery,
} from "@/lib/api/galleries.api";
import type { AddGalleryItemInput, CreateGalleryInput } from "@/types/media";

export function useGalleries(params?: {
  page?: number;
  perPage?: number;
  type?: "image" | "video";
}) {
  return useQuery({
    queryKey: ["galleries", params],
    queryFn: () => listGalleries(params),
  });
}

export function useGallery(id: string, enabled = true) {
  return useQuery({
    queryKey: ["galleries", id],
    queryFn: () => getGallery(id),
    enabled,
  });
}

export function useCreateGallery() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateGalleryInput) => createGallery(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["galleries"] });
    },
  });
}

export function useUpdateGallery() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<CreateGalleryInput>;
    }) => updateGallery(id, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["galleries", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["galleries"] });
    },
  });
}

export function useDeleteGallery() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteGallery(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["galleries"] });
    },
  });
}

export function useAddGalleryItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      galleryId,
      data,
    }: {
      galleryId: string;
      data: AddGalleryItemInput;
    }) => addGalleryItem(galleryId, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["galleries", variables.galleryId],
      });
    },
  });
}

export function useReorderGalleryItems() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      galleryId,
      itemIds,
    }: {
      galleryId: string;
      itemIds: string[];
    }) => reorderGalleryItems(galleryId, itemIds),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["galleries", variables.galleryId],
      });
    },
  });
}

export function useDeleteGalleryItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      galleryId,
      itemId,
    }: {
      galleryId: string;
      itemId: string;
    }) => deleteGalleryItem(galleryId, itemId),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["galleries", variables.galleryId],
      });
    },
  });
}
