"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VideoListClient } from "@/components/videos/video-list-client";

export default function VideoGalleryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" asChild>
        <Link href="/galleries/videos">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to galleries
        </Link>
      </Button>
      <VideoListClient galleryId={id} basePath={`/galleries/videos/${id}`} />
    </div>
  );
}
