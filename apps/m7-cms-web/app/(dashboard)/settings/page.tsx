"use client";

import { RoleGuard } from "@/components/role-guard";
import { SettingsForm } from "@/components/settings/settings-form";

export default function SettingsPage() {
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
      <SettingsForm />
    </RoleGuard>
  );
}
