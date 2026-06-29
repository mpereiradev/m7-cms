import {
  Controller,
  Get,
  Post,
  Delete,
  Put,
  Param,
  Body,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  JwtAuthGuard,
  RolesGuard,
  Roles,
  CurrentUser,
  Role,
  UserContext,
} from '../../../auth/infrastructure/auth.module.js';
import { CreateGalleryUseCase } from '../../application/use-cases/create-gallery.use-case.js';
import { ListGalleriesUseCase } from '../../application/use-cases/list-galleries.use-case.js';
import { AddGalleryItemUseCase } from '../../application/use-cases/add-gallery-item.use-case.js';
import { ReorderGalleryItemsUseCase } from '../../application/use-cases/reorder-gallery-items.use-case.js';
import { DeleteGalleryItemUseCase } from '../../application/use-cases/delete-gallery-item.use-case.js';
import { CreateGalleryDto } from '../../application/dtos/create-gallery.dto.js';
import { AddGalleryItemDto } from '../../application/dtos/add-gallery-item.dto.js';
import {
  GalleryResponseDto,
  GalleryItemResponseDto,
} from '../../application/dtos/gallery-response.dto.js';

@Controller('api/v1/galleries')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN, Role.EDITOR)
export class GalleriesController {
  constructor(
    private readonly createGalleryUseCase: CreateGalleryUseCase,
    private readonly listGalleriesUseCase: ListGalleriesUseCase,
    private readonly addGalleryItemUseCase: AddGalleryItemUseCase,
    private readonly reorderGalleryItemsUseCase: ReorderGalleryItemsUseCase,
    private readonly deleteGalleryItemUseCase: DeleteGalleryItemUseCase,
  ) {}

  @Get()
  async list(
    @CurrentUser() user: UserContext,
  ): Promise<{ data: GalleryResponseDto[] }> {
    const galleries = await this.listGalleriesUseCase.execute(user.tenantId);
    return { data: galleries.map(GalleryResponseDto.fromEntity) };
  }

  @Post()
  async create(
    @CurrentUser() user: UserContext,
    @Body() dto: CreateGalleryDto,
  ): Promise<{ data: GalleryResponseDto }> {
    const gallery = await this.createGalleryUseCase.execute({
      tenantId: user.tenantId,
      slug: dto.slug,
      title: dto.title,
      type: dto.type,
    });
    return { data: GalleryResponseDto.fromEntity(gallery) };
  }

  @Post(':galleryId/items')
  async addItem(
    @CurrentUser() user: UserContext,
    @Param('galleryId', ParseUUIDPipe) galleryId: string,
    @Body() dto: AddGalleryItemDto,
  ): Promise<{ data: GalleryItemResponseDto }> {
    const item = await this.addGalleryItemUseCase.execute({
      tenantId: user.tenantId,
      galleryId,
      mediaId: dto.mediaId,
      order: dto.order,
      caption: dto.caption,
    });
    return { data: GalleryItemResponseDto.fromEntity(item) };
  }

  @Put(':galleryId/items/reorder')
  async reorderItems(
    @CurrentUser() user: UserContext,
    @Param('galleryId', ParseUUIDPipe) galleryId: string,
    @Body() body: { ids: string[] },
  ): Promise<{ data: GalleryItemResponseDto[] }> {
    const items = await this.reorderGalleryItemsUseCase.execute({
      tenantId: user.tenantId,
      galleryId,
      ids: body.ids,
    });
    return { data: items.map(GalleryItemResponseDto.fromEntity) };
  }

  @Delete(':galleryId/items/:itemId')
  async deleteItem(
    @CurrentUser() user: UserContext,
    @Param('galleryId', ParseUUIDPipe) galleryId: string,
    @Param('itemId', ParseUUIDPipe) itemId: string,
  ): Promise<{ data: { deleted: true } }> {
    await this.deleteGalleryItemUseCase.execute({
      tenantId: user.tenantId,
      galleryId,
      itemId,
    });
    return { data: { deleted: true } };
  }
}
