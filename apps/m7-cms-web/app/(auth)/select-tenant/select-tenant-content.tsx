"use client";

import { useAuth } from "@/lib/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Building2, Loader2 } from "lucide-react";

/**
 * Full-page tenant selector shown when the user has multiple tenants
 * and none is selected (middleware redirects here).
 */
export function SelectTenantContent() {
  const { user, isLoading, setTenantId } = useAuth();

  function handleSelect(tenantId: string) {
    setTenantId(tenantId);
    window.location.href = "/dashboard";
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">Selecionar site</h2>
        <p className="text-muted-foreground">
          Voce tem acesso a varios sites. Selecione qual deseja gerenciar.
        </p>
      </div>
      <div className="grid gap-2">
        {user.tenants.map((tenant) => (
          <Button
            key={tenant.id}
            variant="outline"
            className="justify-start gap-3 h-auto py-3 px-4"
            onClick={() => handleSelect(tenant.id)}
          >
            <Building2 className="h-5 w-5 text-muted-foreground" />
            <div className="flex flex-col items-start">
              <span className="font-medium">{tenant.name}</span>
              <span className="text-xs text-muted-foreground">
                {tenant.slug} &middot; {tenant.role}
              </span>
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
}
