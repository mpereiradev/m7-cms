import type { BannerEntity } from '../../domain/entities/banner.entity.js';

export class BannerResponseDto {
  id!: string;
  tenantId!: string;
  title!: string | null;
  mediaId!: string | null;
  ctaLabel!: string | null;
  linkUrl!: string | null;
  displayStart!: string | null;
  displayEnd!: string | null;
  order!: number;
  createdAt!: string;
  updatedAt!: string;

  static fromEntity(entity: BannerEntity): BannerResponseDto {
    const dto = new BannerResponseDto();
    dto.id = entity.id;
    dto.tenantId = entity.tenantId;
    dto.title = entity.title;
    dto.mediaId = entity.mediaId;
    dto.ctaLabel = entity.ctaLabel;
    dto.linkUrl = entity.linkUrl;
    dto.displayStart = entity.displayStart?.toISOString() ?? null;
    dto.displayEnd = entity.displayEnd?.toISOString() ?? null;
    dto.order = entity.order;
    dto.createdAt = entity.createdAt.toISOString();
    dto.updatedAt = entity.updatedAt.toISOString();
    return dto;
  }
}
