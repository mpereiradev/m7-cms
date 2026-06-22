import { GalleryListClient } from "@/components/galleries/gallery-list-client";

export default function VideoGalleriesPage() {
  return (
    <GalleryListClient type="video" basePath="/galleries/videos" />
  );
}
