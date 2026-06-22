import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import {
  JwtAuthGuard,
  RolesGuard,
  Roles,
  CurrentUser,
  Role,
  UserContext,
} from '../../../auth/infrastructure/auth.module.js';
import { CreateTagUseCase } from '../../application/use-cases/create-tag.use-case.js';
import { ListTagsUseCase } from '../../application/use-cases/list-tags.use-case.js';
import { TagResponseDto } from '../../application/dtos/post-response.dto.js';

class CreateTagDto {
  slug!: string;
}

@Controller('api/v1/tags')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TagsController {
  constructor(
    private readonly createTagUseCase: CreateTagUseCase,
    private readonly listTagsUseCase: ListTagsUseCase,
  ) {}

  @Get()
  @Roles(Role.ADMIN, Role.EDITOR, Role.AUTHOR)
  async list(
    @CurrentUser() user: UserContext,
  ): Promise<{ data: TagResponseDto[] }> {
    const tags = await this.listTagsUseCase.execute(user.tenantId);
    return { data: tags.map(TagResponseDto.fromEntity) };
  }

  @Post()
  @Roles(Role.ADMIN, Role.EDITOR)
  async create(
    @CurrentUser() user: UserContext,
    @Body() dto: CreateTagDto,
  ): Promise<{ data: TagResponseDto }> {
    const tag = await this.createTagUseCase.execute({
      tenantId: user.tenantId,
      slug: dto.slug,
    });
    return { data: TagResponseDto.fromEntity(tag) };
  }
}
