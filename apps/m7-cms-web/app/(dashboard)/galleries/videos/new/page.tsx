"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VideoForm } from "@/components/videos/video-form";

export default function NewVideoPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NewVideoContent />
    </Suspense>
  );
}

function NewVideoContent() {
  const searchParams = useSearchParams();
  const galleryId = searchParams.get("galleryId") ?? "";
  const videoId = searchParams.get("videoId") ?? undefined;

  if (!galleryId) {
    return (
      <div className="space-y-6">
        <div className="rounded-md border border-destructive/50 bg-destructive/10 p-4 text-destructive">
          Gallery ID is required. Please navigate from a video gallery.
        </div>
        <Button variant="outline" asChild>
          <Link href="/galleries/videos">Back to video galleries</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" asChild>
        <Link href={`/galleries/videos/${galleryId}`}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to gallery
        </Link>
      </Button>
      <VideoForm
        galleryId={galleryId}
        videoId={videoId}
        backPath={`/galleries/videos/${galleryId}`}
      />
    </div>
  );
}

