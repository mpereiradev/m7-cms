"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useBanners, useDeleteBanner } from "@/lib/hooks/use-banners";
import { getBannerStatus, type Banner } from "@/lib/schemas/banner.schema";
import { statusLabels, statusVariants } from "@/components/banners/banner-preview";

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "-";
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(dateStr));
}

export function BannerListClient() {
  const { data: banners, isLoading } = useBanners();
  const deleteMutation = useDeleteBanner();
  const [deleteTarget, setDeleteTarget] = useState<Banner | null>(null);

  function handleDeleteConfirm() {
    if (!deleteTarget) return;
    deleteMutation.mutate(deleteTarget.id, {
      onSuccess: () => setDeleteTarget(null),
    });
  }

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Banners</h1>
          <p className="text-muted-foreground">
            Gerencie os banners e slides exibidos nas paginas do site.
          </p>
        </div>
        <Button asChild>
          <Link href="/banners/new">
            <Plus className="h-4 w-4" />
            Novo banner
          </Link>
        </Button>
      </div>

      {!banners || banners.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-4">
              Nenhum banner cadastrado.
            </p>
            <Button variant="outline" asChild>
              <Link href="/banners/new">
                <Plus className="h-4 w-4" />
                Criar primeiro banner
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">Imagem</TableHead>
                <TableHead>Titulo</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Inicio</TableHead>
                <TableHead>Termino</TableHead>
                <TableHead className="text-right">Acoes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {banners.map((banner) => {
                const status = getBannerStatus(banner);
                return (
                  <TableRow key={banner.id}>
                    <TableCell>
                      {banner.imageUrl ? (
                        <img
                          src={banner.imageUrl}
                          alt={banner.title}
                          className="h-10 w-16 rounded object-cover"
                        />
                      ) : (
                        <div className="h-10 w-16 rounded bg-muted flex items-center justify-center text-xs text-muted-foreground">
                          Sem img
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">
                      {banner.title}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={statusVariants[status]}
                      >
                        {statusLabels[status]}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(banner.startsAt)}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(banner.endsAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" asChild>
                          <Link href={`/banners/${banner.id}`} title="Editar">
                            <Pencil className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeleteTarget(banner)}
                          title="Remover"
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Card>
      )}

      {/* Delete confirmation */}
      <Dialog
        open={!!deleteTarget}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar exclusao</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja remover o banner &quot;{deleteTarget?.title}
              &quot;? Esta acao nao pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteTarget(null)}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending && (
                <Loader2 className="animate-spin" />
              )}
              Remover
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
