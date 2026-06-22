import { apiRequest } from "@/lib/api/client";

// --- Types ---

export type SubmissionStatus = "new" | "processed";

export type Submission = {
  id: string;
  tenantId: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  status: SubmissionStatus;
  createdAt: string;
  updatedAt: string;
};

export type SubmissionListResponse = {
  data: Submission[];
  total: number;
  page: number;
  perPage: number;
};

// --- API functions ---

export async function listSubmissions(params?: {
  page?: number;
  perPage?: number;
  status?: SubmissionStatus;
  search?: string;
}): Promise<SubmissionListResponse> {
  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.set("page", String(params.page));
  if (params?.perPage) searchParams.set("perPage", String(params.perPage));
  if (params?.status) searchParams.set("status", params.status);
  if (params?.search) searchParams.set("search", params.search);

  const query = searchParams.toString();
  return apiRequest<SubmissionListResponse>(
    `/contact-submissions${query ? `?${query}` : ""}`
  );
}

export async function getSubmission(id: string): Promise<Submission> {
  return apiRequest<Submission>(`/contact-submissions/${id}`);
}

export async function markProcessed(id: string): Promise<Submission> {
  return apiRequest<Submission>(`/contact-submissions/${id}/process`, {
    method: "PATCH",
  });
}
