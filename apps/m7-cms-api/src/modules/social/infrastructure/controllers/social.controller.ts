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
} from '@nestjs/common';
import {
  JwtAuthGuard,
  RolesGuard,
  Roles,
  CurrentUser,
  Role,
  UserContext,
} from '../../../auth/infrastructure/auth.module.js';
import { CreateSocialPostUseCase } from '../../application/use-cases/create-social-post.use-case.js';
import { ListSocialPostsUseCase } from '../../application/use-cases/list-social-posts.use-case.js';
import { UpdateSocialPostUseCase } from '../../application/use-cases/update-social-post.use-case.js';
import { DeleteSocialPostUseCase } from '../../application/use-cases/delete-social-post.use-case.js';
import { ReorderSocialPostsUseCase } from '../../application/use-cases/reorder-social-posts.use-case.js';
import {
  CreateSocialPostDto,
  UpdateSocialPostDto,
} from '../../application/dtos/create-social-post.dto.js';
import { SocialPostResponseDto } from '../../application/dtos/social-post-response.dto.js';

@Controller('api/v1/social-posts')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN, Role.EDITOR)
export class SocialController {
  constructor(
    private readonly createSocialPostUseCase: CreateSocialPostUseCase,
    private readonly listSocialPostsUseCase: ListSocialPostsUseCase,
    private readonly updateSocialPostUseCase: UpdateSocialPostUseCase,
    private readonly deleteSocialPostUseCase: DeleteSocialPostUseCase,
    private readonly reorderSocialPostsUseCase: ReorderSocialPostsUseCase,
  ) {}

  @Get()
  async list(
    @CurrentUser() user: UserContext,
  ): Promise<{ data: SocialPostResponseDto[] }> {
    const posts = await this.listSocialPostsUseCase.execute(user.tenantId);
    return { data: posts.map(SocialPostResponseDto.fromEntity) };
  }

  @Post()
  async create(
    @CurrentUser() user: UserContext,
    @Body() dto: CreateSocialPostDto,
  ): Promise<{ data: SocialPostResponseDto }> {
    const post = await this.createSocialPostUseCase.execute({
      tenantId: user.tenantId,
      platform: dto.platform,
      url: dto.url,
      title: dto.title,
      publishedAt: dto.publishedAt ? new Date(dto.publishedAt) : undefined,
      order: dto.order,
    });
    return { data: SocialPostResponseDto.fromEntity(post) };
  }

  @Put(':id')
  async update(
    @CurrentUser() user: UserContext,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateSocialPostDto,
  ): Promise<{ data: SocialPostResponseDto }> {
    const post = await this.updateSocialPostUseCase.execute(user.tenantId, id, {
      platform: dto.platform,
      url: dto.url,
      title: dto.title,
      publishedAt:
        dto.publishedAt !== undefined
          ? dto.publishedAt
            ? new Date(dto.publishedAt)
            : null
          : undefined,
      order: dto.order,
    });
    return { data: SocialPostResponseDto.fromEntity(post) };
  }

  @Put('reorder')
  async reorder(
    @CurrentUser() user: UserContext,
    @Body() body: { ids: string[] },
  ): Promise<{ data: SocialPostResponseDto[] }> {
    const posts = await this.reorderSocialPostsUseCase.execute({
      tenantId: user.tenantId,
      ids: body.ids,
    });
    return { data: posts.map(SocialPostResponseDto.fromEntity) };
  }

  @Delete(':id')
  async delete(
    @CurrentUser() user: UserContext,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<{ data: { deleted: true } }> {
    await this.deleteSocialPostUseCase.execute(user.tenantId, id);
    return { data: { deleted: true } };
  }
}
