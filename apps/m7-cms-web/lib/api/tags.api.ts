import { apiRequest } from "@/lib/api/client";

export type Tag = {
  id: string;
  tenantId: string;
  name: string;
  slug: string;
  createdAt: string;
};

export async function listTags(): Promise<Tag[]> {
  const res = await apiRequest<{ data: Tag[] }>("/tags");
  return res.data;
}

export async function createTag(
  data: { name: string; slug: string }
): Promise<Tag> {
  const res = await apiRequest<{ data: Tag }>("/tags", {
    method: "POST",
    body: JSON.stringify(data),
  });
  return res.data;
}

export async function deleteTag(id: string): Promise<void> {
  return apiRequest<void>(`/tags/${id}`, { method: "DELETE" });
}
