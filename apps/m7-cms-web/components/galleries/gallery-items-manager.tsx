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
  rectSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Trash2, Image as ImageIcon, Plus } from "lucide-react";
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
import { MediaPicker } from "@/components/media/media-picker";
import {
  useGallery,
  useAddGalleryItem,
  useReorderGalleryItems,
  useDeleteGalleryItem,
} from "@/lib/hooks/use-galleries";
import type { GalleryItem } from "@/types/media";

type GalleryItemsManagerProps = {
  galleryId: string;
};

function SortableItem({
  item,
  onDelete,
}: {
  item: GalleryItem;
  onDelete: (item: GalleryItem) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const isImage =
    item.url &&
    (item.url.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i) ||
      item.thumbnailUrl);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="group relative overflow-hidden rounded-lg border bg-card"
    >
      <div className="aspect-square">
        {isImage ? (
          <img
            src={item.thumbnailUrl || item.url}
            alt={item.caption || "Gallery item"}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-muted">
            <ImageIcon className="h-8 w-8 text-muted-foreground" />
          </div>
        )}
      </div>

      <div className="absolute inset-0 flex items-start justify-between bg-black/0 p-2 opacity-0 transition-all group-hover:bg-black/30 group-hover:opacity-100">
        <button
          className="cursor-grab rounded bg-background/80 p-1.5 active:cursor-grabbing"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-4 w-4" />
        </button>
        <Button
          variant="destructive"
          size="icon"
          className="h-8 w-8"
          onClick={() => onDelete(item)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      {item.caption && (
        <div className="border-t p-2">
          <p className="truncate text-xs">{item.caption}</p>
        </div>
      )}
    </div>
  );
}

export function GalleryItemsManager({ galleryId }: GalleryItemsManagerProps) {
  const { data: gallery, isLoading } = useGallery(galleryId);
  const addItemMutation = useAddGalleryItem();
  const reorderMutation = useReorderGalleryItems();
  const deleteItemMutation = useDeleteGalleryItem();

  const [items, setItems] = useState<GalleryItem[]>([]);
  const [showPicker, setShowPicker] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<GalleryItem | null>(null);

  useEffect(() => {
    if (gallery?.items) {
      setItems(
        [...gallery.items].sort((a, b) => a.order - b.order)
      );
    }
  }, [gallery?.items]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over || active.id === over.id) return;

      setItems((prev) => {
        const oldIndex = prev.findIndex((item) => item.id === active.id);
        const newIndex = prev.findIndex((item) => item.id === over.id);
        const reordered = arrayMove(prev, oldIndex, newIndex);

        reorderMutation.mutate({
          galleryId,
          itemIds: reordered.map((item) => item.id),
        });

        return reordered;
      });
    },
    [galleryId, reorderMutation]
  );

  const handleAddItem = async (result: { id: string; url: string }) => {
    try {
      await addItemMutation.mutateAsync({
        galleryId,
        data: { mediaId: result.id },
      });
      toast.success("Item adicionado a galeria");
    } catch {
      toast.error("Falha ao adicionar item");
    }
  };

  const handleDeleteItem = async () => {
    if (!deleteTarget) return;
    try {
      await deleteItemMutation.mutateAsync({
        galleryId,
        itemId: deleteTarget.id,
      });
      toast.success("Item removido da galeria");
      setDeleteTarget(null);
    } catch {
      toast.error("Falha ao remover item");
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="aspect-square rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (!gallery) {
    return (
      <div className="py-8 text-center text-muted-foreground">
        Galeria nao encontrada
      </div>
    );
  }

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{gallery.title}</h1>
          {gallery.description && (
            <p className="text-sm text-muted-foreground">
              {gallery.description}
            </p>
          )}
        </div>
        <Button onClick={() => setShowPicker(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Adicionar Itens
        </Button>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
          <ImageIcon className="mb-3 h-12 w-12" />
          <p className="text-sm">Esta galeria esta vazia</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => setShowPicker(true)}
          >
            Adicionar primeiro item
          </Button>
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={items.map((i) => i.id)}
            strategy={rectSortingStrategy}
          >
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {items.map((item) => (
                <SortableItem
                  key={item.id}
                  item={item}
                  onDelete={setDeleteTarget}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      <MediaPicker
        open={showPicker}
        onOpenChange={setShowPicker}
        onSelect={handleAddItem}
        accept={gallery.type === "image" ? "image/*" : undefined}
        title="Adicionar midia a galeria"
      />

      <Dialog
        open={!!deleteTarget}
        onOpenChange={() => setDeleteTarget(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remover item</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja remover este item da galeria? O arquivo
              original nao sera excluido.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteItem}
              disabled={deleteItemMutation.isPending}
            >
              {deleteItemMutation.isPending ? "Removendo..." : "Remover"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
