"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
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
import { useStores, useDeleteStore } from "@/lib/hooks/use-stores";
import type { Store } from "@/lib/api/stores.api";

function getStoreName(store: Store, lang = "pt-BR"): string {
  const t = store.translations.find((tr) => tr.languageCode === lang);
  return t?.name ?? store.translations[0]?.name ?? "Sem nome";
}

function getStoreField(store: Store, field: "address" | "phone" | "email", lang = "pt-BR"): string | null {
  const t = store.translations.find((tr) => tr.languageCode === lang);
  return t?.[field] ?? store.translations[0]?.[field] ?? null;
}

export function StoreListClient() {
  const [deleteTarget, setDeleteTarget] = useState<Store | null>(null);

  const { data: stores, isLoading } = useStores();
  const deleteMutation = useDeleteStore();

  async function handleDelete() {
    if (!deleteTarget) return;
    await deleteMutation.mutateAsync(deleteTarget.id);
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

  const storeList = stores ?? [];

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Lojas</h1>
          <p className="text-muted-foreground">
            Gerencie as lojas e filiais do seu site.
          </p>
        </div>
        <Button asChild>
          <Link href="/stores/new">
            <Plus className="h-4 w-4" />
            Nova Loja
          </Link>
        </Button>
      </div>

      {storeList.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-4">
              Nenhuma loja cadastrada.
            </p>
            <Button variant="outline" asChild>
              <Link href="/stores/new">
                <Plus className="mr-2 h-4 w-4" />
                Criar primeira loja
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Endereco</TableHead>
                <TableHead>Telefone</TableHead>
                <TableHead>Idiomas</TableHead>
                <TableHead className="w-[100px]">Acoes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {storeList.map((store) => (
                <TableRow key={store.id}>
                  <TableCell className="font-medium">
                    {getStoreName(store)}
                  </TableCell>
                  <TableCell>
                    {getStoreField(store, "address") ? (
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-muted-foreground" />
                        <span className="truncate max-w-xs">
                          {getStoreField(store, "address")}
                        </span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">--</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {getStoreField(store, "phone") || (
                      <span className="text-muted-foreground">--</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {store.translations.map((t) => (
                        <Badge key={t.languageCode} variant="outline" className="text-xs">
                          {t.languageCode}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/stores/${store.id}`}>
                          <Pencil className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteTarget(store)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}

      <Dialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar exclusao</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir a loja &quot;
              {deleteTarget ? getStoreName(deleteTarget) : ""}
              &quot;? Esta acao nao pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Excluindo..." : "Excluir"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
