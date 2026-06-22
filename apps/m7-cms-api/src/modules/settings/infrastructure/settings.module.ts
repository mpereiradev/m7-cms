import { Module } from '@nestjs/common';
import { AuthModule } from '../../auth/infrastructure/auth.module.js';

import { SETTINGS_REPOSITORY } from '../application/ports/i-settings-repository.port.js';

import { GetSettingsUseCase } from '../application/use-cases/get-settings.use-case.js';
import { UpdateSettingUseCase } from '../application/use-cases/update-setting.use-case.js';
import { BatchUpdateSettingsUseCase } from '../application/use-cases/batch-update-settings.use-case.js';

import { DrizzleSettingsRepository } from './repositories/drizzle-settings.repository.js';
import { SettingsController } from './controllers/settings.controller.js';

@Module({
  imports: [AuthModule],
  controllers: [SettingsController],
  providers: [
    { provide: SETTINGS_REPOSITORY, useClass: DrizzleSettingsRepository },

    GetSettingsUseCase,
    UpdateSettingUseCase,
    BatchUpdateSettingsUseCase,
  ],
  exports: [SETTINGS_REPOSITORY],
})
export class SettingsModule {}
