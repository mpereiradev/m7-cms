"use client";

import { RoleGuard } from "@/components/role-guard";
import { UsersTable } from "@/components/users/users-table";

export default function UsersPage() {
  return (
    <RoleGuard
      roles={["admin", "super_admin"]}
      fallback={
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            Voce nao tem permissao para acessar esta pagina.
          </p>
        </div>
      }
    >
      <UsersTable />
    </RoleGuard>
  );
}
