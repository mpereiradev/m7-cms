"use client";

import { useState } from "react";
import { Plus, Pencil, Globe, UserPlus } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useTenants, useCreateTenant, useUpdateTenant } from "@/lib/hooks/use-tenants";
import { CreateUserDirectDialog } from "@/components/users/create-user-direct-dialog";
import type { Tenant } from "@/lib/api/tenants.api";

const tenantSchema = z.object({
  name: z.string().min(1, "Nome obrigatorio").max(255),
  slug: z
    .string()
    .min(1, "Slug obrigatorio")
    .max(255)
    .regex(/^[a-z0-9-]+$/, "Apenas letras minusculas, numeros e hifens"),
  domain: z.string().max(255).optional().or(z.literal("")),
});

type TenantFormValues = z.infer<typeof tenantSchema>;

function TenantDialog({
  open,
  onOpenChange,
  editTarget,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  editTarget: Tenant | null;
}) {
  const createMutation = useCreateTenant();
  const updateMutation = useUpdateTenant();

  const form = useForm<TenantFormValues>({
    resolver: zodResolver(tenantSchema),
    values: {
      name: editTarget?.name ?? "",
      slug: editTarget?.slug ?? "",
      domain: editTarget?.domain ?? "",
    },
  });

  const isLoading = createMutation.isPending || updateMutation.isPending;

  async function onSubmit(values: TenantFormValues) {
    const payload = {
      name: values.name,
      slug: values.slug,
      domain: values.domain || undefined,
    };

    if (editTarget) {
      await updateMutation.mutateAsync({ id: editTarget.id, data: payload });
    } else {
      await createMutation.mutateAsync(payload);
    }
    form.reset();
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editTarget ? "Editar site" : "Novo site"}</DialogTitle>
          <DialogDescription>
            {editTarget
              ? "Altere as informacoes do site."
              : "Preencha os dados para criar um novo site."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input placeholder="Meu Site" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slug</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="meu-site"
                      {...field}
                      disabled={!!editTarget}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="domain"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dominio (opcional)</FormLabel>
                  <FormControl>
                    <Input placeholder="meusite.com.br" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Salvando..." : editTarget ? "Salvar" : "Criar"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export function TenantsTable() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Tenant | null>(null);
  const [createUserOpen, setCreateUserOpen] = useState(false);
  const [createUserTenantId, setCreateUserTenantId] = useState<string>("");

  const { data, isLoading } = useTenants();

  function openCreate() {
    setEditTarget(null);
    setDialogOpen(true);
  }

  function openEdit(tenant: Tenant) {
    setEditTarget(tenant);
    setDialogOpen(true);
  }

  function openCreateUser(tenant: Tenant) {
    setCreateUserTenantId(tenant.id);
    setCreateUserOpen(true);
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  const tenants = data?.data ?? [];

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Sites</h1>
          <p className="text-muted-foreground">
            Gerencie todos os sites da plataforma.
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4" />
          Novo Site
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Dominio</TableHead>
              <TableHead>Criado em</TableHead>
              <TableHead className="w-[120px]">Acoes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tenants.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  <Globe className="mx-auto h-8 w-8 text-muted-foreground/40 mb-2" />
                  <p className="text-muted-foreground">Nenhum site cadastrado</p>
                </TableCell>
              </TableRow>
            ) : (
              tenants.map((tenant) => (
                <TableRow key={tenant.id}>
                  <TableCell className="font-medium">{tenant.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{tenant.slug}</Badge>
                  </TableCell>
                  <TableCell>
                    {tenant.domain ? (
                      <span className="text-sm">{tenant.domain}</span>
                    ) : (
                      <span className="text-muted-foreground text-sm">--</span>
                    )}
                  </TableCell>
                  <TableCell>{formatDate(tenant.createdAt)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        title="Editar site"
                        onClick={() => openEdit(tenant)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        title="Criar usuario para este site"
                        onClick={() => openCreateUser(tenant)}
                      >
                        <UserPlus className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <TenantDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        editTarget={editTarget}
      />

      <CreateUserDirectDialog
        open={createUserOpen}
        onOpenChange={setCreateUserOpen}
        tenants={tenants}
        defaultTenantId={createUserTenantId}
      />
    </>
  );
}
