import { GalleryListClient } from "@/components/galleries/gallery-list-client";

export default function ImageGalleriesPage() {
  return (
    <GalleryListClient type="image" basePath="/galleries/images" />
  );
}
