"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Plus,
  Trash2,
  Film,
  GripVertical,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";
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
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
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
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useVideos, useDeleteVideo, useReorderVideos } from "@/lib/hooks/use-videos";
import type { VideoItem } from "@/types/media";

type VideoListClientProps = {
  galleryId: string;
  basePath: string;
};

function getProviderLabel(provider: string): string {
  switch (provider) {
    case "youtube":
      return "YouTube";
    case "vimeo":
      return "Vimeo";
    case "local":
      return "Local";
    default:
      return "Externo";
  }
}

function SortableVideoCard({
  video,
  basePath,
  onDelete,
}: {
  video: VideoItem;
  basePath: string;
  onDelete: (video: VideoItem) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: video.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <Card className="group">
        <div className="flex items-start gap-4 p-4">
          <button
            className="mt-1 cursor-grab shrink-0 active:cursor-grabbing"
            {...attributes}
            {...listeners}
          >
            <GripVertical className="h-5 w-5 text-muted-foreground" />
          </button>

          <div className="relative h-20 w-32 shrink-0 overflow-hidden rounded bg-muted">
            {video.thumbnailUrl ? (
              <img
                src={video.thumbnailUrl}
                alt={video.title}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <Film className="h-8 w-8 text-muted-foreground/40" />
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <Link
              href={`/galleries/videos/new?galleryId=${video.galleryId}&videoId=${video.id}`}
              className="font-medium hover:underline"
            >
              {video.title}
            </Link>
            {video.description && (
              <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                {video.description}
              </p>
            )}
            <div className="mt-2 flex items-center gap-2">
              <Badge variant="secondary">{getProviderLabel(video.provider)}</Badge>
              <a
                href={video.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                <ExternalLink className="inline h-3 w-3" /> Abrir
              </a>
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="shrink-0 text-destructive opacity-0 transition-opacity group-hover:opacity-100"
            onClick={() => onDelete(video)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </Card>
    </div>
  );
}

export function VideoListClient({ galleryId, basePath }: VideoListClientProps) {
  const [deleteTarget, setDeleteTarget] = useState<VideoItem | null>(null);
  const [videoList, setVideoList] = useState<VideoItem[]>([]);
  const [listInitialized, setListInitialized] = useState(false);

  const { data, isLoading } = useVideos({ galleryId });
  const deleteMutation = useDeleteVideo();
  const reorderMutation = useReorderVideos();

  // Sync server data into local state for optimistic reordering
  if (data?.data && !listInitialized) {
    setVideoList([...data.data].sort((a, b) => a.order - b.order));
    setListInitialized(true);
  }

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setVideoList((prev) => {
      const oldIndex = prev.findIndex((v) => v.id === active.id);
      const newIndex = prev.findIndex((v) => v.id === over.id);
      const reordered = arrayMove(prev, oldIndex, newIndex);

      reorderMutation.mutate({
        galleryId,
        videoIds: reordered.map((v) => v.id),
      });

      return reordered;
    });
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteMutation.mutateAsync(deleteTarget.id);
      setVideoList((prev) => prev.filter((v) => v.id !== deleteTarget.id));
      toast.success("Video excluido");
      setDeleteTarget(null);
    } catch {
      toast.error("Falha ao excluir video");
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Videos</h1>
          <p className="text-sm text-muted-foreground">
            {videoList.length} {videoList.length === 1 ? "video" : "videos"} cadastrado{videoList.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Button asChild>
          <Link href={`/galleries/videos/new?galleryId=${galleryId}`}>
            <Plus className="mr-2 h-4 w-4" />
            Add Video
          </Link>
        </Button>
      </div>

      {videoList.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
          <Film className="mb-3 h-12 w-12" />
          <p className="text-sm">No videos yet</p>
          <Button variant="outline" className="mt-4" asChild>
            <Link href={`/galleries/videos/new?galleryId=${galleryId}`}>Add your first video</Link>
          </Button>
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={videoList.map((v) => v.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-3">
              {videoList.map((video) => (
                <SortableVideoCard
                  key={video.id}
                  video={video}
                  basePath={basePath}
                  onDelete={setDeleteTarget}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      <Dialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete video</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{deleteTarget?.title}&quot;?
              This action cannot be undone.
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
