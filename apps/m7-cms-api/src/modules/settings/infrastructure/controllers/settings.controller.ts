import { Controller, Get, Put, Post, Body, UseGuards } from '@nestjs/common';
import {
  JwtAuthGuard,
  RolesGuard,
  Roles,
  CurrentUser,
  Role,
  UserContext,
} from '../../../auth/infrastructure/auth.module.js';
import { GetSettingsUseCase } from '../../application/use-cases/get-settings.use-case.js';
import { UpdateSettingUseCase } from '../../application/use-cases/update-setting.use-case.js';
import { BatchUpdateSettingsUseCase } from '../../application/use-cases/batch-update-settings.use-case.js';
import {
  UpdateSettingDto,
  BatchUpdateSettingsDto,
} from '../../application/dtos/update-setting.dto.js';
import { SettingResponseDto } from '../../application/dtos/settings-response.dto.js';

@Controller('api/v1/settings')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SettingsController {
  constructor(
    private readonly getSettingsUseCase: GetSettingsUseCase,
    private readonly updateSettingUseCase: UpdateSettingUseCase,
    private readonly batchUpdateSettingsUseCase: BatchUpdateSettingsUseCase,
  ) {}

  @Get()
  @Roles(Role.ADMIN)
  async list(
    @CurrentUser() user: UserContext,
  ): Promise<{ data: SettingResponseDto[] }> {
    const settings = await this.getSettingsUseCase.execute(user.tenantId);
    return { data: settings.map(SettingResponseDto.fromEntity) };
  }

  @Put()
  @Roles(Role.ADMIN)
  async update(
    @CurrentUser() user: UserContext,
    @Body() dto: UpdateSettingDto,
  ): Promise<{ data: SettingResponseDto }> {
    const setting = await this.updateSettingUseCase.execute(
      user.tenantId,
      dto.key,
      dto.value,
    );
    return { data: SettingResponseDto.fromEntity(setting) };
  }

  @Post('batch')
  @Roles(Role.ADMIN)
  async batchUpdate(
    @CurrentUser() user: UserContext,
    @Body() dto: BatchUpdateSettingsDto,
  ): Promise<{ data: SettingResponseDto[] }> {
    const settings = await this.batchUpdateSettingsUseCase.execute(
      user.tenantId,
      dto.items,
    );
    return { data: settings.map(SettingResponseDto.fromEntity) };
  }
}
