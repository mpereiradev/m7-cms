import { Injectable, Inject } from '@nestjs/common';
import {
  SETTINGS_REPOSITORY,
  type ISettingsRepository,
} from '../ports/i-settings-repository.port.js';
import type { SettingEntity } from '../../domain/entities/setting.entity.js';

@Injectable()
export class GetSettingsUseCase {
  constructor(
    @Inject(SETTINGS_REPOSITORY) private readonly repo: ISettingsRepository,
  ) {}

  async execute(tenantId: string): Promise<SettingEntity[]> {
    return this.repo.findAll(tenantId);
  }
}
