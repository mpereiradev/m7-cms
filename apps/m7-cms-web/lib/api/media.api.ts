import { apiRequest } from "@/lib/api/client";
import { createClient } from "@/lib/supabase/client";
import type {
  MediaItem,
  MediaListParams,
  MediaUploadResponse,
  PaginatedResponse,
} from "@/types/media";

const TENANT_COOKIE_NAME = "m7_tenant_id";

function getTenantId(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(
    new RegExp(`(?:^|;\\s*)${TENANT_COOKIE_NAME}=([^;]*)`)
  );
  return match ? decodeURIComponent(match[1]) : null;
}

/**
 * Upload a media file via multipart FormData.
 * Uses a raw fetch (not apiRequest) because Content-Type must be multipart/form-data.
 */
export async function uploadMedia(
  file: File,
  onProgress?: (percent: number) => void
): Promise<MediaUploadResponse> {
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const formData = new FormData();
  formData.append("file", file);

  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1";

  // XMLHttpRequest for progress tracking
  return new Promise<MediaUploadResponse>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", `${API_BASE_URL}/media/upload`);

    if (session?.access_token) {
      xhr.setRequestHeader("Authorization", `Bearer ${session.access_token}`);
    }

    const tenantId = getTenantId();
    if (tenantId) {
      xhr.setRequestHeader("X-Tenant-ID", tenantId);
    }

    xhr.upload.addEventListener("progress", (e) => {
      if (e.lengthComputable && onProgress) {
        onProgress(Math.round((e.loaded / e.total) * 100));
      }
    });

    xhr.addEventListener("load", () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(JSON.parse(xhr.responseText));
      } else {
        reject(new Error(xhr.responseText || `Upload failed with status ${xhr.status}`));
      }
    });

    xhr.addEventListener("error", () => {
      reject(new Error("Upload failed"));
    });

    xhr.send(formData);
  });
}

/**
 * List media items with pagination and optional filters.
 */
export async function listMedia(
  params?: MediaListParams
): Promise<PaginatedResponse<MediaItem>> {
  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.set("page", String(params.page));
  if (params?.perPage) searchParams.set("perPage", String(params.perPage));
  if (params?.search) searchParams.set("search", params.search);
  if (params?.mimeType) searchParams.set("mimeType", params.mimeType);

  const query = searchParams.toString();
  return apiRequest<PaginatedResponse<MediaItem>>(
    `/media${query ? `?${query}` : ""}`
  );
}

/**
 * Delete a media item by ID.
 */
export async function deleteMedia(id: string): Promise<void> {
  return apiRequest<void>(`/media/${id}`, { method: "DELETE" });
}

/**
 * Get a signed URL for a private media file.
 */
export async function getSignedUrl(id: string): Promise<{ url: string }> {
  return apiRequest<{ url: string }>(`/media/${id}/signed-url`);
}
