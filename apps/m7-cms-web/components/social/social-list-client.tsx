"use client";

import { useCallback, useEffect, useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  GripVertical,
  Plus,
  Trash2,
  Pencil,
  ExternalLink,
  ToggleLeft,
  ToggleRight,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { SocialForm, platformLabels, platformColors } from "@/components/social/social-form";
import {
  useSocialPosts,
  useCreateSocialPost,
  useUpdateSocialPost,
  useDeleteSocialPost,
  useReorderSocialPosts,
} from "@/lib/hooks/use-social-posts";
import type { SocialPost, SocialPostFormValues } from "@/lib/schemas/social-post.schema";

// --- Sortable item ---

function SortableItem({
  post,
  onEdit,
  onToggle,
  onDelete,
}: {
  post: SocialPost;
  onEdit: (post: SocialPost) => void;
  onToggle: (post: SocialPost) => void;
  onDelete: (post: SocialPost) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: post.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="flex items-center gap-3">
      <button
        type="button"
        className="cursor-grab touch-none text-muted-foreground hover:text-foreground"
        {...attributes}
        {...listeners}
        aria-label="Arrastar para reordenar"
      >
        <GripVertical className="h-5 w-5" />
      </button>

      <Card className={`flex-1 ${!post.isActive ? "opacity-60" : ""}`}>
        <CardContent className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3 min-w-0">
            <Badge
              variant="outline"
              className={platformColors[post.platform] ?? platformColors.unknown}
            >
              {platformLabels[post.platform] ?? "Outro"}
            </Badge>
            <a
              href={post.url}
              target="_blank"
              rel="noopener noreferrer"
              className="truncate text-sm text-muted-foreground hover:text-foreground hover:underline max-w-xs"
              title={post.url}
            >
              {post.url}
            </a>
            <ExternalLink className="h-3 w-3 flex-shrink-0 text-muted-foreground" />
          </div>

          <div className="flex items-center gap-1 flex-shrink-0">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onToggle(post)}
              title={post.isActive ? "Desativar" : "Ativar"}
            >
              {post.isActive ? (
                <ToggleRight className="h-4 w-4 text-green-600" />
              ) : (
                <ToggleLeft className="h-4 w-4 text-muted-foreground" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(post)}
              title="Editar"
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(post)}
              title="Remover"
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// --- Main list ---

export function SocialListClient() {
  const { data: posts, isLoading } = useSocialPosts();
  const createMutation = useCreateSocialPost();
  const updateMutation = useUpdateSocialPost();
  const deleteMutation = useDeleteSocialPost();
  const reorderMutation = useReorderSocialPosts();

  const [formOpen, setFormOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<SocialPost | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<SocialPost | null>(null);

  // Local ordered list for optimistic DnD
  const [localPosts, setLocalPosts] = useState<SocialPost[] | null>(null);
  const displayPosts = localPosts ?? posts ?? [];

  // Sync local state when server data changes
  useEffect(() => {
    if (posts && localPosts && !reorderMutation.isPending) {
      setLocalPosts(null);
    }
  }, [posts, localPosts, reorderMutation.isPending]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over || active.id === over.id || !posts) return;

      const currentItems = localPosts ?? posts;
      const oldIndex = currentItems.findIndex((p) => p.id === active.id);
      const newIndex = currentItems.findIndex((p) => p.id === over.id);

      if (oldIndex === -1 || newIndex === -1) return;

      const reordered = arrayMove(currentItems, oldIndex, newIndex);
      setLocalPosts(reordered);

      const orderedIds = reordered.map((p) => p.id);
      reorderMutation.mutate(orderedIds, {
        onSettled: () => setLocalPosts(null),
      });
    },
    [posts, localPosts, reorderMutation]
  );

  function handleCreate(data: SocialPostFormValues) {
    createMutation.mutate(data, {
      onSuccess: () => setFormOpen(false),
    });
  }

  function handleEdit(post: SocialPost) {
    setEditingPost(post);
  }

  function handleUpdate(data: SocialPostFormValues) {
    if (!editingPost) return;
    updateMutation.mutate(
      { id: editingPost.id, data },
      { onSuccess: () => setEditingPost(null) }
    );
  }

  function handleToggle(post: SocialPost) {
    updateMutation.mutate({
      id: post.id,
      data: { isActive: !post.isActive },
    });
  }

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
          <h1 className="text-2xl font-bold tracking-tight">
            Publicacoes Sociais
          </h1>
          <p className="text-muted-foreground">
            Gerencie os links de publicacoes de redes sociais exibidos no site.
          </p>
        </div>
        <Button onClick={() => setFormOpen(true)}>
          <Plus className="h-4 w-4" />
          Nova publicacao
        </Button>
      </div>

      {displayPosts.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-4">
              Nenhuma publicacao social cadastrada.
            </p>
            <Button variant="outline" onClick={() => setFormOpen(true)}>
              <Plus className="h-4 w-4" />
              Adicionar primeira publicacao
            </Button>
          </CardContent>
        </Card>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={displayPosts.map((p) => p.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-2">
              {displayPosts.map((post) => (
                <SortableItem
                  key={post.id}
                  post={post}
                  onEdit={handleEdit}
                  onToggle={handleToggle}
                  onDelete={setDeleteTarget}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {/* Create dialog */}
      <SocialForm
        open={formOpen}
        onOpenChange={setFormOpen}
        onSubmit={handleCreate}
        isLoading={createMutation.isPending}
        mode="create"
      />

      {/* Edit dialog */}
      <SocialForm
        open={!!editingPost}
        onOpenChange={(open) => {
          if (!open) setEditingPost(null);
        }}
        onSubmit={handleUpdate}
        defaultValues={
          editingPost
            ? { url: editingPost.url, isActive: editingPost.isActive }
            : undefined
        }
        isLoading={updateMutation.isPending}
        mode="edit"
      />

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
              Tem certeza que deseja remover esta publicacao? Esta acao nao pode
              ser desfeita.
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
