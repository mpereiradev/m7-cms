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

function getTenantId(session: { user?: { user_metadata?: Record<string, string> } } | null): string | null {
  return (
    (typeof document !== "undefined"
      ? document.cookie.match(/(?:^|;\s*)m7_tenant_id=([^;]*)/)?.[1]
      : null) ??
    session?.user?.user_metadata?.tenant_id ??
    (typeof window !== "undefined"
      ? localStorage.getItem("tenant_id")
      : null) ??
    null
  );
}

async function doFetch(
  url: string,
  accessToken: string | null,
  tenantId: string | null,
  init?: RequestInit
): Promise<Response> {
  const headers = new Headers(init?.headers);

  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  if (tenantId) {
    headers.set("X-Tenant-ID", tenantId);
  }

  if (!headers.has("Content-Type") && !(init?.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  return fetch(url, { ...init, headers });
}

function forceLogout() {
  if (typeof document !== "undefined") {
    document.cookie = "m7_tenant_id=; path=/; max-age=0";
  }
  if (typeof window !== "undefined") {
    window.location.href = "/logout";
  }
}

async function parseError(response: Response): Promise<string> {
  const body = await response.text();
  try {
    const json = JSON.parse(body);
    return json.message || json.error || body;
  } catch {
    return body;
  }
}

export async function apiRequest<T>(
  path: string,
  init?: RequestInit
): Promise<T> {
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const url = path.startsWith("http") ? path : `${API_BASE_URL}${path}`;
  const tenantId = getTenantId(session);

  const response = await doFetch(url, session?.access_token ?? null, tenantId, init);

  if (response.status === 401 && session?.refresh_token) {
    const { data: refreshData, error: refreshError } =
      await supabase.auth.refreshSession({ refresh_token: session.refresh_token });

    if (refreshError || !refreshData.session) {
      await supabase.auth.signOut();
      forceLogout();
      throw new ApiError(401, "Session expired. Redirecting to login.");
    }

    const retryResponse = await doFetch(
      url,
      refreshData.session.access_token,
      tenantId,
      init
    );

    if (retryResponse.status === 401) {
      await supabase.auth.signOut();
      forceLogout();
      throw new ApiError(401, "Session expired. Redirecting to login.");
    }

    if (!retryResponse.ok) {
      throw new ApiError(retryResponse.status, await parseError(retryResponse));
    }

    if (retryResponse.status === 204) return undefined as T;
    return retryResponse.json() as Promise<T>;
  }

  if (!response.ok) {
    throw new ApiError(response.status, await parseError(response));
  }

  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}
