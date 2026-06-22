import type { SettingEntity } from '../../domain/entities/setting.entity.js';

export const SETTINGS_REPOSITORY = Symbol('SETTINGS_REPOSITORY');

export interface ISettingsRepository {
  findAll(tenantId: string): Promise<SettingEntity[]>;
  findByKey(tenantId: string, key: string): Promise<SettingEntity | null>;
  upsert(tenantId: string, key: string, value: unknown): Promise<SettingEntity>;
  batchUpsert(
    tenantId: string,
    items: { key: string; value: unknown }[],
  ): Promise<SettingEntity[]>;
}
