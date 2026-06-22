import type { SocialPostEntity } from '../../domain/entities/social-post.entity.js';

export class SocialPostResponseDto {
  id!: string;
  tenantId!: string;
  platform!: string;
  url!: string;
  title!: string | null;
  publishedAt!: string | null;
  order!: number;
  createdAt!: string;
  updatedAt!: string;

  static fromEntity(entity: SocialPostEntity): SocialPostResponseDto {
    const dto = new SocialPostResponseDto();
    dto.id = entity.id;
    dto.tenantId = entity.tenantId;
    dto.platform = entity.platform;
    dto.url = entity.url;
    dto.title = entity.title;
    dto.publishedAt = entity.publishedAt
      ? entity.publishedAt.toISOString()
      : null;
    dto.order = entity.order;
    dto.createdAt = entity.createdAt.toISOString();
    dto.updatedAt = entity.updatedAt.toISOString();
    return dto;
  }
}
