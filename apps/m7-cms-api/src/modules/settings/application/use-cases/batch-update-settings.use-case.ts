import { Injectable, Inject } from '@nestjs/common';
import {
  SETTINGS_REPOSITORY,
  type ISettingsRepository,
} from '../ports/i-settings-repository.port.js';
import type { SettingEntity } from '../../domain/entities/setting.entity.js';

@Injectable()
export class BatchUpdateSettingsUseCase {
  constructor(
    @Inject(SETTINGS_REPOSITORY) private readonly repo: ISettingsRepository,
  ) {}

  async execute(
    tenantId: string,
    items: { key: string; value: unknown }[],
  ): Promise<SettingEntity[]> {
    return this.repo.batchUpsert(tenantId, items);
  }
}
