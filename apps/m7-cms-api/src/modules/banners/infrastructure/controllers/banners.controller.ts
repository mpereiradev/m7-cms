import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
  Headers,
} from '@nestjs/common';
import {
  JwtAuthGuard,
  RolesGuard,
  Roles,
  CurrentUser,
  Role,
  UserContext,
} from '../../../auth/infrastructure/auth.module.js';
import { CreateBannerUseCase } from '../../application/use-cases/create-banner.use-case.js';
import { UpdateBannerUseCase } from '../../application/use-cases/update-banner.use-case.js';
import { DeleteBannerUseCase } from '../../application/use-cases/delete-banner.use-case.js';
import { ListBannersUseCase } from '../../application/use-cases/list-banners.use-case.js';
import { ListActiveBannersUseCase } from '../../application/use-cases/list-active-banners.use-case.js';
import {
  CreateBannerDto,
  UpdateBannerDto,
} from '../../application/dtos/create-banner.dto.js';
import { BannerResponseDto } from '../../application/dtos/banner-response.dto.js';

@Controller('api/v1/banners')
@UseGuards(JwtAuthGuard, RolesGuard)
export class BannersController {
  constructor(
    private readonly createBannerUseCase: CreateBannerUseCase,
    private readonly updateBannerUseCase: UpdateBannerUseCase,
    private readonly deleteBannerUseCase: DeleteBannerUseCase,
    private readonly listBannersUseCase: ListBannersUseCase,
  ) {}

  @Get()
  @Roles(Role.ADMIN, Role.EDITOR)
  async list(
    @CurrentUser() user: UserContext,
  ): Promise<{ data: BannerResponseDto[] }> {
    const banners = await this.listBannersUseCase.execute(user.tenantId);
    return { data: banners.map(BannerResponseDto.fromEntity) };
  }

  @Post()
  @Roles(Role.ADMIN)
  async create(
    @CurrentUser() user: UserContext,
    @Body() dto: CreateBannerDto,
  ): Promise<{ data: BannerResponseDto }> {
    const banner = await this.createBannerUseCase.execute({
      tenantId: user.tenantId,
      title: dto.title,
      mediaId: dto.mediaId,
      ctaLabel: dto.ctaLabel,
      linkUrl: dto.linkUrl,
      displayStart: dto.displayStart ? new Date(dto.displayStart) : null,
      displayEnd: dto.displayEnd ? new Date(dto.displayEnd) : null,
      order: dto.order,
    });
    return { data: BannerResponseDto.fromEntity(banner) };
  }

  @Put(':id')
  @Roles(Role.ADMIN)
  async update(
    @CurrentUser() user: UserContext,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateBannerDto,
  ): Promise<{ data: BannerResponseDto }> {
    const banner = await this.updateBannerUseCase.execute(user.tenantId, id, {
      title: dto.title,
      mediaId: dto.mediaId,
      ctaLabel: dto.ctaLabel,
      linkUrl: dto.linkUrl,
      displayStart: dto.displayStart ? new Date(dto.displayStart) : undefined,
      displayEnd: dto.displayEnd ? new Date(dto.displayEnd) : undefined,
      order: dto.order,
    });
    return { data: BannerResponseDto.fromEntity(banner) };
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(
    @CurrentUser() user: UserContext,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    await this.deleteBannerUseCase.execute(user.tenantId, id);
  }
}

@Controller('api/v1/public/banners')
export class PublicBannersController {
  constructor(
    private readonly listActiveBannersUseCase: ListActiveBannersUseCase,
  ) {}

  @Get()
  async list(
    @Headers('x-tenant-id') tenantId: string,
  ): Promise<{ data: BannerResponseDto[] }> {
    const banners = await this.listActiveBannersUseCase.execute(tenantId);
    return { data: banners.map(BannerResponseDto.fromEntity) };
  }
}
