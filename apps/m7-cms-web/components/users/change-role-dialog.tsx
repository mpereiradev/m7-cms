"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUpdateRole } from "@/lib/hooks/use-users";
import {
  changeRoleSchema,
  type ChangeRoleFormValues,
} from "@/lib/schemas/invite-user.schema";
import type { TenantUser } from "@/lib/api/users.api";

const ROLE_LABELS: Record<string, string> = {
  admin: "Administrador",
  editor: "Editor",
  author: "Autor",
  viewer: "Visualizador",
};

type ChangeRoleDialogProps = {
  user: TenantUser | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function ChangeRoleDialog({
  user,
  open,
  onOpenChange,
}: ChangeRoleDialogProps) {
  const updateRole = useUpdateRole();

  const resolvedDefault: ChangeRoleFormValues["role"] =
    user?.role && user.role !== "super_admin" ? user.role : "editor";

  const form = useForm<ChangeRoleFormValues>({
    resolver: zodResolver(changeRoleSchema),
    defaultValues: {
      role: resolvedDefault,
    },
  });

  // Reset form when user changes
  if (user && form.getValues("role") !== resolvedDefault && !form.formState.isDirty) {
    form.reset({ role: resolvedDefault });
  }

  async function onSubmit(values: ChangeRoleFormValues) {
    if (!user) return;
    await updateRole.mutateAsync({ userId: user.id, data: values });
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Alterar Papel</DialogTitle>
          <DialogDescription>
            Alterar o papel de {user?.fullName || user?.email}.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Novo Papel</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um papel" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.entries(ROLE_LABELS).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
              <Button type="submit" disabled={updateRole.isPending}>
                {updateRole.isPending ? "Salvando..." : "Salvar"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
