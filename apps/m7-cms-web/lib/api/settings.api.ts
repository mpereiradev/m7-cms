import { apiRequest } from "@/lib/api/client";

// --- Types ---

export type SettingGroup = "seo" | "integrations" | "notifications" | "general";

export type Setting = {
  id: string;
  tenantId: string;
  key: string;
  value: string;
  group: SettingGroup;
  label: string;
  description: string | null;
  fieldType: "text" | "textarea" | "boolean" | "select";
  options: string[] | null; // For select fields
  createdAt: string;
  updatedAt: string;
};

export type UpdateSettingPayload = {
  value: string;
};

export type BatchUpdatePayload = {
  settings: Array<{
    key: string;
    value: string;
  }>;
};

// --- API functions ---

export async function getSettings(): Promise<Setting[]> {
  return apiRequest<Setting[]>("/settings");
}

export async function updateSetting(
  key: string,
  data: UpdateSettingPayload
): Promise<Setting> {
  return apiRequest<Setting>(`/settings/${key}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function batchUpdateSettings(
  data: BatchUpdatePayload
): Promise<Setting[]> {
  return apiRequest<Setting[]>("/settings/batch", {
    method: "PUT",
    body: JSON.stringify(data),
  });
}
