"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";
import type { Banner, BannerStatus } from "@/lib/schemas/banner.schema";
import { getBannerStatus } from "@/lib/schemas/banner.schema";

const statusLabels: Record<BannerStatus, string> = {
  active: "Ativo",
  scheduled: "Agendado",
  expired: "Expirado",
  inactive: "Inativo",
};

const statusVariants: Record<BannerStatus, string> = {
  active: "bg-green-500/10 text-green-700 border-green-200",
  scheduled: "bg-blue-500/10 text-blue-700 border-blue-200",
  expired: "bg-orange-500/10 text-orange-700 border-orange-200",
  inactive: "bg-gray-400/10 text-gray-600 border-gray-200",
};

type BannerPreviewProps = {
  banner: Pick<Banner, "title" | "imageUrl" | "ctaLabel" | "ctaUrl" | "isActive" | "startsAt" | "endsAt">;
  showStatus?: boolean;
};

export function BannerPreview({ banner, showStatus = false }: BannerPreviewProps) {
  const status = showStatus
    ? getBannerStatus(banner as Banner)
    : null;

  return (
    <Card className="overflow-hidden">
      <div className="relative aspect-[21/9] bg-muted">
        {banner.imageUrl ? (
          <img
            src={banner.imageUrl}
            alt={banner.title}
            className="object-cover w-full h-full"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
            Sem imagem
          </div>
        )}

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

        {/* Text overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
          <h3 className="text-lg font-semibold line-clamp-2">
            {banner.title || "Titulo do banner"}
          </h3>
          {banner.ctaLabel && (
            <div className="mt-2">
              <span className="inline-flex items-center gap-1 rounded bg-white/20 px-3 py-1 text-sm font-medium backdrop-blur-sm">
                {banner.ctaLabel}
                {banner.ctaUrl && <ExternalLink className="h-3 w-3" />}
              </span>
            </div>
          )}
        </div>

        {/* Status badge */}
        {status && (
          <div className="absolute top-3 right-3">
            <Badge variant="outline" className={statusVariants[status]}>
              {statusLabels[status]}
            </Badge>
          </div>
        )}
      </div>
    </Card>
  );
}

export { statusLabels, statusVariants };
