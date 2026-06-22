"use client";

import { useCallback, useRef, useState } from "react";
import { Upload, X, FileIcon, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useUploadMedia } from "@/lib/hooks/use-media";

type UploadingFile = {
  file: File;
  progress: number;
  status: "uploading" | "done" | "error";
  error?: string;
};

type MediaUploaderProps = {
  onUploadComplete?: () => void;
  accept?: string;
  multiple?: boolean;
  className?: string;
};

export function MediaUploader({
  onUploadComplete,
  accept = "image/*,video/*,application/pdf",
  multiple = true,
  className,
}: MediaUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadMutation = useUploadMedia();

  const processFiles = useCallback(
    async (files: FileList | File[]) => {
      const fileArray = Array.from(files);
      if (fileArray.length === 0) return;

      const newEntries: UploadingFile[] = fileArray.map((file) => ({
        file,
        progress: 0,
        status: "uploading" as const,
      }));

      setUploadingFiles((prev) => [...prev, ...newEntries]);

      for (let i = 0; i < fileArray.length; i++) {
        const file = fileArray[i];
        const entryIndex =
          uploadingFiles.length + i;

        try {
          await uploadMutation.mutateAsync({
            file,
            onProgress: (percent) => {
              setUploadingFiles((prev) => {
                const updated = [...prev];
                const target = updated[entryIndex];
                if (target) {
                  updated[entryIndex] = { ...target, progress: percent };
                }
                return updated;
              });
            },
          });

          setUploadingFiles((prev) => {
            const updated = [...prev];
            const target = updated[entryIndex];
            if (target) {
              updated[entryIndex] = { ...target, status: "done", progress: 100 };
            }
            return updated;
          });
        } catch (err) {
          const message = err instanceof Error ? err.message : "Upload failed";
          setUploadingFiles((prev) => {
            const updated = [...prev];
            const target = updated[entryIndex];
            if (target) {
              updated[entryIndex] = {
                ...target,
                status: "error",
                error: message,
              };
            }
            return updated;
          });
          toast.error(`Failed to upload ${file.name}: ${message}`);
        }
      }

      onUploadComplete?.();
    },
    [uploadMutation, uploadingFiles.length, onUploadComplete]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      processFiles(e.dataTransfer.files);
    },
    [processFiles]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        processFiles(e.target.files);
        e.target.value = "";
      }
    },
    [processFiles]
  );

  const clearCompleted = useCallback(() => {
    setUploadingFiles((prev) => prev.filter((f) => f.status === "uploading"));
  }, []);

  const hasCompleted = uploadingFiles.some(
    (f) => f.status === "done" || f.status === "error"
  );

  return (
    <div className={cn("space-y-4", className)}>
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-colors",
          isDragging
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50"
        )}
      >
        <Upload className="mb-3 h-10 w-10 text-muted-foreground" />
        <p className="text-sm font-medium">
          Drag and drop files here, or click to browse
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Images, videos, and documents
        </p>
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {uploadingFiles.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">Uploads</p>
            {hasCompleted && (
              <Button variant="ghost" size="sm" onClick={clearCompleted}>
                Clear completed
              </Button>
            )}
          </div>
          {uploadingFiles.map((entry, index) => (
            <div
              key={`${entry.file.name}-${index}`}
              className="flex items-center gap-3 rounded-md border p-3"
            >
              <FileIcon className="h-5 w-5 shrink-0 text-muted-foreground" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm">{entry.file.name}</p>
                {entry.status === "uploading" && (
                  <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary transition-all"
                      style={{ width: `${entry.progress}%` }}
                    />
                  </div>
                )}
                {entry.status === "error" && (
                  <p className="mt-1 text-xs text-destructive">{entry.error}</p>
                )}
              </div>
              {entry.status === "done" && (
                <CheckCircle2 className="h-5 w-5 shrink-0 text-green-500" />
              )}
              {entry.status === "error" && (
                <X className="h-5 w-5 shrink-0 text-destructive" />
              )}
              {entry.status === "uploading" && (
                <span className="text-xs text-muted-foreground">
                  {entry.progress}%
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
