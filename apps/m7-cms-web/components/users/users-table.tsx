"use client";

import { useState, useMemo } from "react";
import { Plus, UserPlus, MoreHorizontal, Shield, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useUsers, useRemoveUser } from "@/lib/hooks/use-users";
import { useTenants } from "@/lib/hooks/use-tenants";
import { useAuth } from "@/lib/hooks/use-auth";
import { InviteUserDialog } from "@/components/users/invite-user-dialog";
import { ChangeRoleDialog } from "@/components/users/change-role-dialog";
import { CreateUserDirectDialog } from "@/components/users/create-user-direct-dialog";
import { isGlobalUser } from "@/lib/api/users.api";
import type { TenantUser, GlobalUser } from "@/lib/api/users.api";

const ROLE_LABELS: Record<string, string> = {
  super_admin: "Super Admin",
  admin: "Administrador",
  editor: "Editor",
  author: "Autor",
  viewer: "Visualizador",
};

export function UsersTable() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [createDirectOpen, setCreateDirectOpen] = useState(false);
  const [changeRoleTarget, setChangeRoleTarget] = useState<TenantUser | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<TenantUser | null>(null);

  const { data, isLoading } = useUsers({ page, perPage: 20, search });
  const removeMutation = useRemoveUser();
  const { role, tenantId } = useAuth();
  const { data: tenantsData } = useTenants({ enabled: role === "super_admin" });

  const isSuperAdmin = role === "super_admin";

  const rawUsers = data?.data ?? [];
  const isGlobalView = isSuperAdmin && rawUsers.length > 0 && isGlobalUser(rawUsers[0]);

  const globalUsers = useMemo<GlobalUser[]>(() => {
    if (!isGlobalView) return [];
    const all = rawUsers as GlobalUser[];
    if (!search.trim()) return all;
    const q = search.toLowerCase();
    return all.filter(
      (u) =>
        u.name?.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.tenants.some((t) => t.tenantName.toLowerCase().includes(q))
    );
  }, [rawUsers, isGlobalView, search]);

  const tenantUsers = useMemo<TenantUser[]>(() => {
    if (isGlobalView) return [];
    return rawUsers as TenantUser[];
  }, [rawUsers, isGlobalView]);

  async function handleRemove() {
    if (!deleteTarget) return;
    await removeMutation.mutateAsync(deleteTarget.id);
    setDeleteTarget(null);
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Usuarios</h1>
          <p className="text-muted-foreground">
            {isSuperAdmin
              ? "Visao global de todos os usuarios cadastrados."
              : "Gerencie os usuarios e papeis do seu site."}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {isSuperAdmin && (
            <Button variant="outline" onClick={() => setCreateDirectOpen(true)}>
              <UserPlus className="h-4 w-4" />
              Criar Usuario
            </Button>
          )}
          <Button onClick={() => setInviteOpen(true)}>
            <Plus className="h-4 w-4" />
            Convidar Usuario
          </Button>
        </div>
      </div>

      <div className="mb-4">
        <Input
          placeholder="Buscar por nome, e-mail ou site..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="max-w-sm"
        />
      </div>

      {isGlobalView ? (
        <GlobalUsersTable users={globalUsers} />
      ) : (
        <TenantUsersTable
          users={tenantUsers}
          onChangeRole={setChangeRoleTarget}
          onDelete={setDeleteTarget}
        />
      )}

      <InviteUserDialog open={inviteOpen} onOpenChange={setInviteOpen} />

      <CreateUserDirectDialog
        open={createDirectOpen}
        onOpenChange={setCreateDirectOpen}
        tenants={tenantsData?.data ?? []}
        defaultTenantId={tenantId ?? undefined}
      />

      <ChangeRoleDialog
        user={changeRoleTarget}
        open={!!changeRoleTarget}
        onOpenChange={(open) => {
          if (!open) setChangeRoleTarget(null);
        }}
      />

      <Dialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar remocao</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja remover o usuario &quot;
              {deleteTarget?.name || deleteTarget?.email}&quot;? O usuario
              perdera o acesso a este site.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleRemove}
              disabled={removeMutation.isPending}
            >
              {removeMutation.isPending ? "Removendo..." : "Remover"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function GlobalUsersTable({ users }: { users: GlobalUser[] }) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>E-mail</TableHead>
            <TableHead>Sites</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3} className="text-center py-8">
                Nenhum usuario encontrado
              </TableCell>
            </TableRow>
          ) : (
            users.map((user) => (
              <TableRow key={user.userId}>
                <TableCell className="font-medium">
                  {user.name || (
                    <span className="text-muted-foreground italic">Sem nome</span>
                  )}
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {user.tenants.length === 0 ? (
                      <span className="text-xs text-muted-foreground italic">
                        Sem sites
                      </span>
                    ) : (
                      user.tenants.map((t) => (
                        <Badge
                          key={t.tenantId}
                          variant="secondary"
                          className="text-xs"
                          title={ROLE_LABELS[t.role] ?? t.role}
                        >
                          {t.tenantName}
                          <span className="ml-1 text-muted-foreground">
                            · {ROLE_LABELS[t.role] ?? t.role}
                          </span>
                        </Badge>
                      ))
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}

function TenantUsersTable({
  users,
  onChangeRole,
  onDelete,
}: {
  users: TenantUser[];
  onChangeRole: (user: TenantUser) => void;
  onDelete: (user: TenantUser) => void;
}) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>E-mail</TableHead>
            <TableHead>Papel</TableHead>
            <TableHead className="w-[80px]">Acoes</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-8">
                Nenhum usuario encontrado
              </TableCell>
            </TableRow>
          ) : (
            users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">
                  {user.name || (
                    <span className="text-muted-foreground italic">Sem nome</span>
                  )}
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {ROLE_LABELS[user.role] ?? user.role}
                  </Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onChangeRole(user)}>
                        <Shield className="mr-2 h-4 w-4" />
                        Alterar Papel
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => onDelete(user)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Remover
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
