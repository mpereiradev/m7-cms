"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MediaUploader } from "@/components/media/media-uploader";
import { MediaGrid } from "@/components/media/media-grid";
import { useMedia } from "@/lib/hooks/use-media";

export default function MediaLibraryPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [showUploader, setShowUploader] = useState(false);

  const { data, isLoading } = useMedia({
    page,
    perPage: 30,
    search: search || undefined,
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Media Library</h1>
          <p className="text-muted-foreground">
            Upload and manage your media files
          </p>
        </div>
        <Button onClick={() => setShowUploader(!showUploader)}>
          {showUploader ? "Hide Uploader" : "Upload Files"}
        </Button>
      </div>

      {showUploader && (
        <MediaUploader onUploadComplete={() => setShowUploader(false)} />
      )}

      <div className="flex items-center gap-4">
        <Input
          placeholder="Search files..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="max-w-sm"
        />
        {data && (
          <span className="text-sm text-muted-foreground">
            {data.meta.total} {data.meta.total === 1 ? "file" : "files"}
          </span>
        )}
      </div>

      <MediaGrid items={data?.data ?? []} isLoading={isLoading} />

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
    </div>
  );
}
