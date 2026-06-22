import type { SettingEntity } from '../../domain/entities/setting.entity.js';

export class SettingResponseDto {
  id!: string;
  key!: string;
  value!: unknown;
  createdAt!: string;
  updatedAt!: string;

  static fromEntity(entity: SettingEntity): SettingResponseDto {
    const dto = new SettingResponseDto();
    dto.id = entity.id;
    dto.key = entity.key;
    dto.value = entity.value;
    dto.createdAt = entity.createdAt.toISOString();
    dto.updatedAt = entity.updatedAt.toISOString();
    return dto;
  }
}
