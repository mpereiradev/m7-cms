import type { TenantEntity } from '../../domain/entities/tenant.entity.js';

export class TenantResponseDto {
  id!: string;
  slug!: string;
  name!: string;
  domain!: string | null;
  logoUrl!: string | null;
  languages!: string[];
  theme!: string | null;
  createdAt!: string;
  updatedAt!: string;

  static fromEntity(entity: TenantEntity): TenantResponseDto {
    const dto = new TenantResponseDto();
    dto.id = entity.id;
    dto.slug = entity.slug;
    dto.name = entity.name;
    dto.domain = entity.domain;
    dto.logoUrl = entity.logoUrl;
    dto.languages = entity.languages;
    dto.theme = entity.theme;
    dto.createdAt = entity.createdAt.toISOString();
    dto.updatedAt = entity.updatedAt.toISOString();
    return dto;
  }
}
