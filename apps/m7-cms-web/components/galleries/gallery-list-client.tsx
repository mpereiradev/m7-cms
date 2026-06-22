"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Trash2, Image as ImageIcon, Film } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useGalleries, useCreateGallery, useDeleteGallery } from "@/lib/hooks/use-galleries";
import type { Gallery } from "@/types/media";

type GalleryListClientProps = {
  type: "image" | "video";
  basePath: string;
};

export function GalleryListClient({ type, basePath }: GalleryListClientProps) {
  const [showCreate, setShowCreate] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Gallery | null>(null);
  const [newTitle, setNewTitle] = useState("");

  const { data, isLoading } = useGalleries({ type });
  const createMutation = useCreateGallery();
  const deleteMutation = useDeleteGallery();

  const handleCreate = async () => {
    if (!newTitle.trim()) return;
    try {
      await createMutation.mutateAsync({ title: newTitle.trim(), type });
      toast.success("Gallery created");
      setNewTitle("");
      setShowCreate(false);
    } catch {
      toast.error("Failed to create gallery");
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteMutation.mutateAsync(deleteTarget.id);
      toast.success("Gallery deleted");
      setDeleteTarget(null);
    } catch {
      toast.error("Failed to delete gallery");
    }
  };

  const TypeIcon = type === "image" ? ImageIcon : Film;

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-48 rounded-lg" />
        ))}
      </div>
    );
  }

  const galleries = data?.data ?? [];

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            {type === "image" ? "Image Galleries" : "Video Galleries"}
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage your {type} galleries
          </p>
        </div>
        <Button onClick={() => setShowCreate(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Gallery
        </Button>
      </div>

      {galleries.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
          <TypeIcon className="mb-3 h-12 w-12" />
          <p className="text-sm">No galleries yet</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => setShowCreate(true)}
          >
            Create your first gallery
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {galleries.map((gallery) => (
            <Card key={gallery.id} className="group relative overflow-hidden">
              <Link href={`${basePath}/${gallery.id}`}>
                <div className="aspect-video bg-muted">
                  {gallery.coverUrl ? (
                    <img
                      src={gallery.coverUrl}
                      alt={gallery.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <TypeIcon className="h-12 w-12 text-muted-foreground/40" />
                    </div>
                  )}
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{gallery.title}</CardTitle>
                  <CardDescription>
                    {gallery.itemCount} {gallery.itemCount === 1 ? "item" : "items"}
                  </CardDescription>
                </CardHeader>
              </Link>
              <CardContent className="pt-0">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive opacity-0 transition-opacity group-hover:opacity-100"
                  onClick={(e) => {
                    e.preventDefault();
                    setDeleteTarget(gallery);
                  }}
                >
                  <Trash2 className="mr-1 h-4 w-4" />
                  Delete
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create Dialog */}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create gallery</DialogTitle>
            <DialogDescription>
              Give your new {type} gallery a name.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="gallery-title">Title</Label>
              <Input
                id="gallery-title"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Gallery title"
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleCreate();
                }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreate(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleCreate}
              disabled={!newTitle.trim() || createMutation.isPending}
            >
              {createMutation.isPending ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete gallery</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{deleteTarget?.title}&quot;?
              All items in this gallery will also be removed. This action cannot
              be undone.
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
