"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { MediaGrid } from "@/components/media/media-grid";
import { MediaUploader } from "@/components/media/media-uploader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMedia } from "@/lib/hooks/use-media";
import type { MediaItem, MediaPickerResult } from "@/types/media";

type MediaPickerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (result: MediaPickerResult) => void;
  accept?: string;
  title?: string;
};

export function MediaPicker({
  open,
  onOpenChange,
  onSelect,
  accept,
  title = "Select media",
}: MediaPickerProps) {
  const [search, setSearch] = useState("");
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);
  const [page, setPage] = useState(1);

  const mimeTypeFilter = accept?.startsWith("image/") ? "image" : undefined;

  const { data, isLoading } = useMedia({
    page,
    perPage: 20,
    search: search || undefined,
    mimeType: mimeTypeFilter,
  });

  const handleConfirm = () => {
    if (selectedItem) {
      onSelect({
        id: selectedItem.id,
        url: selectedItem.url,
        filename: selectedItem.originalFilename,
      });
      setSelectedItem(null);
      onOpenChange(false);
    }
  };

  const handleClose = () => {
    setSelectedItem(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-h-[85vh] max-w-4xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Browse existing files or upload a new one.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="browse">
          <TabsList>
            <TabsTrigger value="browse">Browse</TabsTrigger>
            <TabsTrigger value="upload">Upload</TabsTrigger>
          </TabsList>

          <TabsContent value="browse" className="space-y-4">
            <Input
              placeholder="Search files..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
            <MediaGrid
              items={data?.data ?? []}
              isLoading={isLoading}
              selectable
              onSelect={setSelectedItem}
              selectedId={selectedItem?.id}
            />
            {data && data.meta.totalPages > 1 && (
              <div className="flex items-center justify-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  Previous
                </Button>
                <span className="text-sm text-muted-foreground">
                  Page {page} of {data.meta.totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= data.meta.totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="upload">
            <MediaUploader accept={accept} />
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={!selectedItem}>
            Select
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
