import { createClient } from "@/lib/supabase/client";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1";

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/**
 * Base fetch wrapper that attaches JWT from Supabase session + X-Tenant-ID header.
 * Used by all API calls in the admin panel.
 */
export async function apiRequest<T>(
  path: string,
  init?: RequestInit
): Promise<T> {
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const headers = new Headers(init?.headers);

  if (session?.access_token) {
    headers.set("Authorization", `Bearer ${session.access_token}`);
  }

  // Tenant ID: cookie (set by AuthProvider) > user metadata > localStorage fallback
  const tenantId =
    (typeof document !== "undefined"
      ? document.cookie.match(/(?:^|;\s*)m7_tenant_id=([^;]*)/)?.[1]
      : null) ??
    session?.user?.user_metadata?.tenant_id ??
    (typeof window !== "undefined"
      ? localStorage.getItem("tenant_id")
      : null);

  if (tenantId) {
    headers.set("X-Tenant-ID", tenantId);
  }

  headers.set("Content-Type", "application/json");

  const url = path.startsWith("http") ? path : `${API_BASE_URL}${path}`;

  const response = await fetch(url, {
    ...init,
    headers,
  });

  if (!response.ok) {
    const body = await response.text();
    let message: string;
    try {
      const json = JSON.parse(body);
      message = json.message || json.error || body;
    } catch {
      message = body;
    }
    throw new ApiError(response.status, message);
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}
