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
  title = "Selecionar midia",
}: MediaPickerProps) {
  const [search, setSearch] = useState("");
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);
  const [activeTab, setActiveTab] = useState("browse");

  const mimeTypeFilter = accept?.startsWith("image/") ? "image" : undefined;

  const { data, isLoading } = useMedia({
    perPage: 30,
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

  const handleUploadComplete = () => {
    setActiveTab("browse");
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-h-[85vh] max-w-4xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Navegue pelos arquivos existentes ou envie um novo.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="browse">Biblioteca</TabsTrigger>
            <TabsTrigger value="upload">Enviar novo</TabsTrigger>
          </TabsList>

          <TabsContent value="browse" className="space-y-4">
            <Input
              placeholder="Buscar arquivos..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <MediaGrid
              items={data?.data ?? []}
              isLoading={isLoading}
              selectable
              onSelect={setSelectedItem}
              selectedId={selectedItem?.id}
            />
            {data?.data && (
              <p className="text-center text-sm text-muted-foreground">
                {data.data.length} {data.data.length === 1 ? "arquivo" : "arquivos"}
              </p>
            )}
          </TabsContent>

          <TabsContent value="upload">
            <MediaUploader
              accept={accept}
              onUploadComplete={handleUploadComplete}
            />
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancelar
          </Button>
          <Button onClick={handleConfirm} disabled={!selectedItem}>
            Selecionar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
