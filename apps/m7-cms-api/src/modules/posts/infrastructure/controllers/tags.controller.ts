import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  UseGuards,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
  Inject,
} from '@nestjs/common';
import { IsString, MaxLength } from 'class-validator';
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
import {
  TAG_REPOSITORY,
  type ITagRepository,
} from '../../application/ports/i-post-repository.port.js';

class CreateTagDto {
  @IsString()
  @MaxLength(255)
  name!: string;

  @IsString()
  @MaxLength(255)
  slug!: string;
}

@Controller('api/v1/tags')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TagsController {
  constructor(
    private readonly createTagUseCase: CreateTagUseCase,
    private readonly listTagsUseCase: ListTagsUseCase,
    @Inject(TAG_REPOSITORY)
    private readonly tagRepository: ITagRepository,
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
      name: dto.name,
      slug: dto.slug,
    });
    return { data: TagResponseDto.fromEntity(tag) };
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(
    @CurrentUser() user: UserContext,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    await this.tagRepository.delete(user.tenantId, id);
  }
}
