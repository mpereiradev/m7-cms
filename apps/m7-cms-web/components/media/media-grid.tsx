"use client";

import { useState } from "react";
import { Trash2, Image as ImageIcon, FileIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useDeleteMedia } from "@/lib/hooks/use-media";
import type { MediaItem } from "@/types/media";

type MediaGridProps = {
  items: MediaItem[];
  isLoading?: boolean;
  onSelect?: (item: MediaItem) => void;
  selectable?: boolean;
  selectedId?: string | null;
  className?: string;
};

function isImageMimeType(mimeType: string): boolean {
  return mimeType.startsWith("image/");
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function MediaGrid({
  items,
  isLoading,
  onSelect,
  selectable = false,
  selectedId,
  className,
}: MediaGridProps) {
  const [deleteTarget, setDeleteTarget] = useState<MediaItem | null>(null);
  const deleteMutation = useDeleteMedia();

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteMutation.mutateAsync(deleteTarget.id);
      toast.success(`${deleteTarget.originalFilename} deleted`);
      setDeleteTarget(null);
    } catch {
      toast.error("Failed to delete file");
    }
  };

  if (isLoading) {
    return (
      <div className={cn("grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5", className)}>
        {Array.from({ length: 10 }).map((_, i) => (
          <Skeleton key={i} className="aspect-square rounded-lg" />
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
        <ImageIcon className="mb-3 h-12 w-12" />
        <p className="text-sm">No media files found</p>
      </div>
    );
  }

  return (
    <>
      <div
        className={cn(
          "grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5",
          className
        )}
      >
        {items.map((item) => (
          <div
            key={item.id}
            className={cn(
              "group relative overflow-hidden rounded-lg border bg-muted transition-all",
              selectable && "cursor-pointer hover:ring-2 hover:ring-primary",
              selectedId === item.id && "ring-2 ring-primary"
            )}
            onClick={() => {
              if (selectable && onSelect) {
                onSelect(item);
              }
            }}
          >
            <div className="aspect-square">
              {isImageMimeType(item.mimeType) ? (
                <img
                  src={item.thumbnailUrl || item.url}
                  alt={item.alt || item.originalFilename}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center gap-2 p-4">
                  <FileIcon className="h-10 w-10 text-muted-foreground" />
                  <span className="line-clamp-2 text-center text-xs text-muted-foreground">
                    {item.originalFilename}
                  </span>
                </div>
              )}
            </div>

            {!selectable && (
              <div className="absolute inset-0 flex items-start justify-end bg-black/0 p-2 opacity-0 transition-all group-hover:bg-black/30 group-hover:opacity-100">
                <Button
                  variant="destructive"
                  size="icon"
                  className="h-8 w-8"
                  onClick={(e) => {
                    e.stopPropagation();
                    setDeleteTarget(item);
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            )}

            <div className="border-t p-2">
              <p className="truncate text-xs font-medium">
                {item.originalFilename}
              </p>
              <p className="text-xs text-muted-foreground">
                {formatFileSize(item.size)}
              </p>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete media</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{deleteTarget?.originalFilename}
              &quot;? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
