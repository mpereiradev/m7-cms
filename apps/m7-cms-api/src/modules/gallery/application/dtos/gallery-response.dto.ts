import type { GalleryEntity } from '../../domain/entities/gallery.entity.js';
import type { GalleryItemEntity } from '../../domain/entities/gallery-item.entity.js';
import type { VideoEntity } from '../../domain/entities/video.entity.js';

export class GalleryResponseDto {
  id!: string;
  tenantId!: string;
  slug!: string;
  createdAt!: string;
  updatedAt!: string;

  static fromEntity(entity: GalleryEntity): GalleryResponseDto {
    const dto = new GalleryResponseDto();
    dto.id = entity.id;
    dto.tenantId = entity.tenantId;
    dto.slug = entity.slug;
    dto.createdAt = entity.createdAt.toISOString();
    dto.updatedAt = entity.updatedAt.toISOString();
    return dto;
  }
}

export class GalleryItemResponseDto {
  id!: string;
  galleryId!: string;
  mediaId!: string;
  order!: number;
  caption!: Record<string, string> | null;
  createdAt!: string;
  updatedAt!: string;

  static fromEntity(entity: GalleryItemEntity): GalleryItemResponseDto {
    const dto = new GalleryItemResponseDto();
    dto.id = entity.id;
    dto.galleryId = entity.galleryId;
    dto.mediaId = entity.mediaId;
    dto.order = entity.order;
    dto.caption = entity.caption;
    dto.createdAt = entity.createdAt.toISOString();
    dto.updatedAt = entity.updatedAt.toISOString();
    return dto;
  }
}

export class VideoResponseDto {
  id!: string;
  tenantId!: string;
  sourceType!: string;
  url!: string;
  title!: string;
  description!: Record<string, string> | null;
  thumbnailMediaId!: string | null;
  order!: number;
  createdAt!: string;
  updatedAt!: string;

  static fromEntity(entity: VideoEntity): VideoResponseDto {
    const dto = new VideoResponseDto();
    dto.id = entity.id;
    dto.tenantId = entity.tenantId;
    dto.sourceType = entity.sourceType;
    dto.url = entity.url;
    dto.title = entity.title;
    dto.description = entity.description;
    dto.thumbnailMediaId = entity.thumbnailMediaId;
    dto.order = entity.order;
    dto.createdAt = entity.createdAt.toISOString();
    dto.updatedAt = entity.updatedAt.toISOString();
    return dto;
  }
}
