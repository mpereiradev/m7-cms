"use client";

import { RoleGuard } from "@/components/role-guard";
import { TenantsTable } from "@/components/tenants/tenants-table";

export default function TenantsPage() {
  return (
    <RoleGuard
      roles={["super_admin"]}
      fallback={
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            Voce nao tem permissao para acessar esta pagina.
          </p>
        </div>
      }
    >
      <TenantsTable />
    </RoleGuard>
  );
}
