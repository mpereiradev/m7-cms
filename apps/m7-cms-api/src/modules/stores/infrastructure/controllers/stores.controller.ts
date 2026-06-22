import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Headers,
  UseGuards,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  JwtAuthGuard,
  RolesGuard,
  Roles,
  CurrentUser,
  Role,
  UserContext,
} from '../../../auth/infrastructure/auth.module.js';
import { CreateStoreUseCase } from '../../application/use-cases/create-store.use-case.js';
import { UpdateStoreUseCase } from '../../application/use-cases/update-store.use-case.js';
import { DeleteStoreUseCase } from '../../application/use-cases/delete-store.use-case.js';
import { ListStoresUseCase } from '../../application/use-cases/list-stores.use-case.js';
import { SetStoreHoursUseCase } from '../../application/use-cases/set-store-hours.use-case.js';
import {
  CreateStoreDto,
  UpdateStoreDto,
} from '../../application/dtos/create-store.dto.js';
import { SetStoreHoursDto } from '../../application/dtos/store-hours.dto.js';
import { StoreResponseDto } from '../../application/dtos/store-response.dto.js';

@Controller('api/v1/stores')
@UseGuards(JwtAuthGuard, RolesGuard)
export class StoresController {
  constructor(
    private readonly createStoreUseCase: CreateStoreUseCase,
    private readonly updateStoreUseCase: UpdateStoreUseCase,
    private readonly deleteStoreUseCase: DeleteStoreUseCase,
    private readonly listStoresUseCase: ListStoresUseCase,
    private readonly setStoreHoursUseCase: SetStoreHoursUseCase,
  ) {}

  @Get()
  @Roles(Role.ADMIN, Role.EDITOR)
  async list(
    @CurrentUser() user: UserContext,
  ): Promise<{ data: StoreResponseDto[] }> {
    const stores = await this.listStoresUseCase.execute(user.tenantId);
    return { data: stores.map(StoreResponseDto.fromEntity) };
  }

  @Post()
  @Roles(Role.ADMIN)
  async create(
    @CurrentUser() user: UserContext,
    @Body() dto: CreateStoreDto,
  ): Promise<{ data: StoreResponseDto }> {
    const store = await this.createStoreUseCase.execute({
      tenantId: user.tenantId,
      slug: dto.slug,
      translations: dto.translations,
    });
    return { data: StoreResponseDto.fromEntity(store) };
  }

  @Put(':id')
  @Roles(Role.ADMIN)
  async update(
    @CurrentUser() user: UserContext,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateStoreDto,
  ): Promise<{ data: StoreResponseDto }> {
    const store = await this.updateStoreUseCase.execute(user.tenantId, id, dto);
    return { data: StoreResponseDto.fromEntity(store) };
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(
    @CurrentUser() user: UserContext,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    await this.deleteStoreUseCase.execute(user.tenantId, id);
  }

  @Put(':id/hours')
  @Roles(Role.ADMIN)
  async setHours(
    @CurrentUser() user: UserContext,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: SetStoreHoursDto,
  ): Promise<{ data: StoreResponseDto }> {
    const store = await this.setStoreHoursUseCase.execute(
      user.tenantId,
      id,
      dto,
    );
    return { data: StoreResponseDto.fromEntity(store) };
  }
}

@Controller('api/v1/public/stores')
export class PublicStoresController {
  constructor(private readonly listStoresUseCase: ListStoresUseCase) {}

  @Get()
  async list(
    @Headers('x-tenant-id') tenantId: string,
  ): Promise<{ data: StoreResponseDto[] }> {
    const stores = await this.listStoresUseCase.execute(tenantId);
    return { data: stores.map(StoreResponseDto.fromEntity) };
  }
}
