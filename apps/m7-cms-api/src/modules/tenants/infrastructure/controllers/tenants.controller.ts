import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Body,
  UseGuards,
  ParseUUIDPipe,
  ForbiddenException,
} from '@nestjs/common';
import {
  JwtAuthGuard,
  RolesGuard,
  Roles,
  CurrentUser,
  Role,
  UserContext,
} from '../../../auth/infrastructure/auth.module.js';
import { CreateTenantUseCase } from '../../application/use-cases/create-tenant.use-case.js';
import { GetTenantUseCase } from '../../application/use-cases/get-tenant.use-case.js';
import { UpdateTenantUseCase } from '../../application/use-cases/update-tenant.use-case.js';
import { ListTenantsUseCase } from '../../application/use-cases/list-tenants.use-case.js';
import { CreateTenantDto } from '../../application/dtos/create-tenant.dto.js';
import { UpdateTenantDto } from '../../application/dtos/update-tenant.dto.js';
import { TenantResponseDto } from '../../application/dtos/tenant-response.dto.js';

@Controller('api/v1/tenants')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TenantsController {
  constructor(
    private readonly createTenantUseCase: CreateTenantUseCase,
    private readonly getTenantUseCase: GetTenantUseCase,
    private readonly updateTenantUseCase: UpdateTenantUseCase,
    private readonly listTenantsUseCase: ListTenantsUseCase,
  ) {}

  @Get()
  @Roles(Role.SUPER_ADMIN)
  async list(): Promise<{ data: TenantResponseDto[] }> {
    const tenants = await this.listTenantsUseCase.execute();
    return { data: tenants.map(TenantResponseDto.fromEntity) };
  }

  @Get(':id')
  @Roles(Role.ADMIN)
  async getById(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: UserContext,
  ): Promise<{ data: TenantResponseDto }> {
    // ADMIN can only access their own tenant; SUPER_ADMIN can access any
    if (user.role !== Role.SUPER_ADMIN && user.tenantId !== id) {
      throw new ForbiddenException(
        'You can only access your own tenant.',
      );
    }
    const tenant = await this.getTenantUseCase.execute(id);
    return { data: TenantResponseDto.fromEntity(tenant) };
  }

  @Post()
  @Roles(Role.SUPER_ADMIN)
  async create(
    @Body() dto: CreateTenantDto,
  ): Promise<{ data: TenantResponseDto }> {
    const tenant = await this.createTenantUseCase.execute(dto);
    return { data: TenantResponseDto.fromEntity(tenant) };
  }

  @Put(':id')
  @Roles(Role.SUPER_ADMIN)
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateTenantDto,
  ): Promise<{ data: TenantResponseDto }> {
    const tenant = await this.updateTenantUseCase.execute(id, dto);
    return { data: TenantResponseDto.fromEntity(tenant) };
  }
}
