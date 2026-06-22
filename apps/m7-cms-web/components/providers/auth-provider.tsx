"use client";

import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { getCurrentUser } from "@/lib/api/auth.api";
import type { AuthState, Role, UserContext } from "@/types/auth";

export const AuthContext = createContext<AuthState | null>(null);

const TENANT_COOKIE_NAME = "m7_tenant_id";

function getTenantIdFromCookie(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(
    new RegExp(`(?:^|;\\s*)${TENANT_COOKIE_NAME}=([^;]*)`)
  );
  return match ? decodeURIComponent(match[1]) : null;
}

function setTenantIdCookie(tenantId: string) {
  document.cookie = `${TENANT_COOKIE_NAME}=${encodeURIComponent(tenantId)}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
}

function removeTenantIdCookie() {
  document.cookie = `${TENANT_COOKIE_NAME}=; path=/; max-age=0`;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const supabase = createClient();
  const [user, setUser] = useState<UserContext | null>(null);
  const [tenantId, setTenantIdState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadUser = useCallback(async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        setUser(null);
        setTenantIdState(null);
        setIsLoading(false);
        return;
      }

      const userData = await getCurrentUser();
      setUser(userData);

      // Restore tenant from cookie or default to first tenant
      const cookieTenantId = getTenantIdFromCookie();
      if (cookieTenantId && userData.tenants.some((t) => t.id === cookieTenantId)) {
        setTenantIdState(cookieTenantId);
      } else if (userData.tenants.length === 1) {
        const singleTenantId = userData.tenants[0].id;
        setTenantIdState(singleTenantId);
        setTenantIdCookie(singleTenantId);
      }
      // If multiple tenants and no cookie, tenantId stays null => TenantSelector kicks in
    } catch {
      setUser(null);
      setTenantIdState(null);
    } finally {
      setIsLoading(false);
    }
  }, [supabase.auth]);

  useEffect(() => {
    loadUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        setUser(null);
        setTenantIdState(null);
        removeTenantIdCookie();
      } else {
        loadUser();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [loadUser, supabase.auth]);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    removeTenantIdCookie();
    setUser(null);
    setTenantIdState(null);
    router.push("/login");
  }, [supabase.auth, router]);

  const setTenantId = useCallback((id: string) => {
    setTenantIdState(id);
    setTenantIdCookie(id);
  }, []);

  const role: Role | null = useMemo(() => {
    if (!user || !tenantId) return null;
    const tenantInfo = user.tenants.find((t) => t.id === tenantId);
    return tenantInfo?.role ?? user.role;
  }, [user, tenantId]);

  const value = useMemo<AuthState>(
    () => ({
      user,
      tenantId,
      role,
      isLoading,
      isAuthenticated: !!user,
      signOut,
      setTenantId,
    }),
    [user, tenantId, role, isLoading, signOut, setTenantId]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
