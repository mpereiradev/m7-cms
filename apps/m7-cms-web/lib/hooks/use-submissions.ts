"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  listSubmissions,
  getSubmission,
  markProcessed,
  type SubmissionStatus,
} from "@/lib/api/submissions.api";

export function useSubmissions(params?: {
  page?: number;
  perPage?: number;
  status?: SubmissionStatus;
  search?: string;
}) {
  return useQuery({
    queryKey: ["submissions", params],
    queryFn: () => listSubmissions(params),
  });
}

export function useSubmission(id: string | undefined) {
  return useQuery({
    queryKey: ["submissions", id],
    queryFn: () => getSubmission(id!),
    enabled: !!id,
  });
}

export function useMarkProcessed() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => markProcessed(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["submissions"] });
      toast.success("Mensagem marcada como processada");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erro ao processar mensagem");
    },
  });
}
