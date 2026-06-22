import type { TenantUserEntity } from '../../domain/entities/tenant-user.entity.js';

export class UserResponseDto {
  id!: string;
  userId!: string;
  tenantId!: string;
  role!: string;
  email!: string;
  name!: string;
  photoUrl!: string | null;
  createdAt!: string;
  updatedAt!: string;

  static fromEntity(entity: TenantUserEntity): UserResponseDto {
    const dto = new UserResponseDto();
    dto.id = entity.id;
    dto.userId = entity.userId;
    dto.tenantId = entity.tenantId;
    dto.role = entity.role;
    dto.email = entity.email;
    dto.name = entity.name;
    dto.photoUrl = entity.photoUrl;
    dto.createdAt = entity.createdAt.toISOString();
    dto.updatedAt = entity.updatedAt.toISOString();
    return dto;
  }
}
