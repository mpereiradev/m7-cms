import type { UserGlobalEntity } from '../../domain/entities/user-global.entity.js';

export class UserGlobalResponseDto {
  userId!: string;
  email!: string;
  name!: string;
  photoUrl!: string | null;
  tenants!: {
    tenantId: string;
    tenantName: string;
    tenantSlug: string;
    role: string;
  }[];

  static fromEntity(entity: UserGlobalEntity): UserGlobalResponseDto {
    const dto = new UserGlobalResponseDto();
    dto.userId = entity.userId;
    dto.email = entity.email;
    dto.name = entity.name;
    dto.photoUrl = entity.photoUrl;
    dto.tenants = entity.tenants;
    return dto;
  }
}
