"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/use-auth";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Building2 } from "lucide-react";

/**
 * Modal dialog shown after login when the user belongs to more than one tenant.
 * The user must pick a tenant before proceeding to the dashboard.
 */
export function TenantSelector() {
  const { user, tenantId, setTenantId } = useAuth();
  const router = useRouter();

  // Only show when authenticated, has multiple tenants, and none selected
  const isOpen = !!user && user.tenants.length > 1 && !tenantId;

  function handleSelect(selectedTenantId: string) {
    setTenantId(selectedTenantId);
    router.push("/dashboard");
  }

  return (
    <Dialog open={isOpen}>
      <DialogContent
        className="sm:max-w-md"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Selecionar site</DialogTitle>
          <DialogDescription>
            Voce tem acesso a varios sites. Selecione qual deseja gerenciar.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-2 py-4">
          {user?.tenants.map((tenant) => (
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
      </DialogContent>
    </Dialog>
  );
}
