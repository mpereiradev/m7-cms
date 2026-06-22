import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Body,
  UseGuards,
  ParseUUIDPipe,
  Delete,
  NotFoundException,
} from '@nestjs/common';
import {
  JwtAuthGuard,
  RolesGuard,
  Roles,
  CurrentUser,
  Role,
  UserContext,
} from '../../../auth/infrastructure/auth.module.js';
import { CreateVideoUseCase } from '../../application/use-cases/create-video.use-case.js';
import { ListVideosUseCase } from '../../application/use-cases/list-videos.use-case.js';
import { ReorderVideosUseCase } from '../../application/use-cases/reorder-videos.use-case.js';
import { CreateVideoDto } from '../../application/dtos/create-video.dto.js';
import { VideoResponseDto } from '../../application/dtos/gallery-response.dto.js';
import {
  GALLERY_REPOSITORY,
  type IGalleryRepository,
} from '../../application/ports/i-gallery-repository.port.js';
import { Inject } from '@nestjs/common';

@Controller('api/v1/videos')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN, Role.EDITOR)
export class VideosController {
  constructor(
    private readonly createVideoUseCase: CreateVideoUseCase,
    private readonly listVideosUseCase: ListVideosUseCase,
    private readonly reorderVideosUseCase: ReorderVideosUseCase,
    @Inject(GALLERY_REPOSITORY)
    private readonly galleryRepository: IGalleryRepository,
  ) {}

  @Get()
  async list(
    @CurrentUser() user: UserContext,
  ): Promise<{ data: VideoResponseDto[] }> {
    const videos = await this.listVideosUseCase.execute(user.tenantId);
    return { data: videos.map(VideoResponseDto.fromEntity) };
  }

  @Post()
  async create(
    @CurrentUser() user: UserContext,
    @Body() dto: CreateVideoDto,
  ): Promise<{ data: VideoResponseDto }> {
    const video = await this.createVideoUseCase.execute({
      tenantId: user.tenantId,
      sourceType: dto.sourceType,
      url: dto.url,
      title: dto.title,
      description: dto.description,
      thumbnailMediaId: dto.thumbnailMediaId,
      order: dto.order,
    });
    return { data: VideoResponseDto.fromEntity(video) };
  }

  @Put('reorder')
  async reorder(
    @CurrentUser() user: UserContext,
    @Body() body: { ids: string[] },
  ): Promise<{ data: VideoResponseDto[] }> {
    const videos = await this.reorderVideosUseCase.execute({
      tenantId: user.tenantId,
      ids: body.ids,
    });
    return { data: videos.map(VideoResponseDto.fromEntity) };
  }

  @Delete(':id')
  async delete(
    @CurrentUser() user: UserContext,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<{ data: { deleted: true } }> {
    const deleted = await this.galleryRepository.deleteVideo(user.tenantId, id);
    if (!deleted) {
      throw new NotFoundException(`Video with id "${id}" not found.`);
    }
    return { data: { deleted: true } };
  }
}
