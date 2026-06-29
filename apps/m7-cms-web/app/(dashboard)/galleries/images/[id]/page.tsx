"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GalleryItemsManager } from "@/components/galleries/gallery-items-manager";

export default function ImageGalleryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" asChild>
        <Link href="/galleries/images">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para galerias
        </Link>
      </Button>
      <GalleryItemsManager galleryId={id} />
    </div>
  );
}
