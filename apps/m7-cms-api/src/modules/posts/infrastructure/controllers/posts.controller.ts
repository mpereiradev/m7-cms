import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
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
import { CreatePostUseCase } from '../../application/use-cases/create-post.use-case.js';
import { UpdatePostUseCase } from '../../application/use-cases/update-post.use-case.js';
import { PublishPostUseCase } from '../../application/use-cases/publish-post.use-case.js';
import { SchedulePostUseCase } from '../../application/use-cases/schedule-post.use-case.js';
import { DeletePostUseCase } from '../../application/use-cases/delete-post.use-case.js';
import { GetPostUseCase } from '../../application/use-cases/get-post.use-case.js';
import { ListPostsUseCase } from '../../application/use-cases/list-posts.use-case.js';
import {
  CreatePostDto,
  UpdatePostDto,
} from '../../application/dtos/create-post.dto.js';
import { ListPostsFilterDto } from '../../application/dtos/list-posts-filter.dto.js';
import { PostResponseDto } from '../../application/dtos/post-response.dto.js';

@Controller('api/v1/posts')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PostsController {
  constructor(
    private readonly createPostUseCase: CreatePostUseCase,
    private readonly updatePostUseCase: UpdatePostUseCase,
    private readonly publishPostUseCase: PublishPostUseCase,
    private readonly schedulePostUseCase: SchedulePostUseCase,
    private readonly deletePostUseCase: DeletePostUseCase,
    private readonly getPostUseCase: GetPostUseCase,
    private readonly listPostsUseCase: ListPostsUseCase,
  ) {}

  @Get()
  @Roles(Role.ADMIN, Role.EDITOR, Role.AUTHOR)
  async list(
    @CurrentUser() user: UserContext,
    @Query() filters: ListPostsFilterDto,
  ): Promise<{ data: PostResponseDto[] }> {
    const posts = await this.listPostsUseCase.execute(user.tenantId, filters);
    return { data: posts.map(PostResponseDto.fromEntity) };
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.EDITOR, Role.AUTHOR)
  async get(
    @CurrentUser() user: UserContext,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<{ data: PostResponseDto }> {
    const post = await this.getPostUseCase.execute(user.tenantId, id);
    return { data: PostResponseDto.fromEntity(post) };
  }

  @Post()
  @Roles(Role.ADMIN, Role.EDITOR, Role.AUTHOR)
  async create(
    @CurrentUser() user: UserContext,
    @Body() dto: CreatePostDto,
  ): Promise<{ data: PostResponseDto }> {
    const post = await this.createPostUseCase.execute({
      tenantId: user.tenantId,
      slug: dto.slug,
      authorId: user.userId,
      categoryIds: dto.categoryIds,
      tagIds: dto.tagIds,
      translations: dto.translations,
    });
    return { data: PostResponseDto.fromEntity(post) };
  }

  @Put(':id')
  @Roles(Role.ADMIN, Role.EDITOR, Role.AUTHOR)
  async update(
    @CurrentUser() user: UserContext,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdatePostDto,
  ): Promise<{ data: PostResponseDto }> {
    const post = await this.updatePostUseCase.execute(user.tenantId, id, dto);
    return { data: PostResponseDto.fromEntity(post) };
  }

  @Post(':id/publish')
  @Roles(Role.ADMIN, Role.EDITOR)
  async publish(
    @CurrentUser() user: UserContext,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<{ data: PostResponseDto }> {
    const post = await this.publishPostUseCase.execute(user.tenantId, id);
    return { data: PostResponseDto.fromEntity(post) };
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.EDITOR)
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(
    @CurrentUser() user: UserContext,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    await this.deletePostUseCase.execute(user.tenantId, id);
  }
}

@Controller('api/v1/public/posts')
export class PublicPostsController {
  constructor(private readonly listPostsUseCase: ListPostsUseCase) {}

  @Get()
  async list(
    @Headers('x-tenant-id') tenantId: string,
    @Query() filters: ListPostsFilterDto,
  ): Promise<{ data: PostResponseDto[] }> {
    const posts = await this.listPostsUseCase.execute(tenantId, {
      ...filters,
      status: 'published',
    });
    return { data: posts.map(PostResponseDto.fromEntity) };
  }
}
