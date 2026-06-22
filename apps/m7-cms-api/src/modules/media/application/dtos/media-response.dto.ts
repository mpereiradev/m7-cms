import type { MediaEntity } from '../../domain/entities/media.entity.js';

export class MediaResponseDto {
  id!: string;
  tenantId!: string;
  filename!: string;
  url!: string;
  mimeType!: string;
  size!: number | null;
  width!: number | null;
  height!: number | null;
  createdAt!: string;
  updatedAt!: string;

  static fromEntity(entity: MediaEntity): MediaResponseDto {
    const dto = new MediaResponseDto();
    dto.id = entity.id;
    dto.tenantId = entity.tenantId;
    dto.filename = entity.filename;
    dto.url = entity.url;
    dto.mimeType = entity.mimeType;
    dto.size = entity.size;
    dto.width = entity.width;
    dto.height = entity.height;
    dto.createdAt = entity.createdAt.toISOString();
    dto.updatedAt = entity.updatedAt.toISOString();
    return dto;
  }
}
