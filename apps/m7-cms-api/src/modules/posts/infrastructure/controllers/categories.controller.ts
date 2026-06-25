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
} from '@nestjs/common';
import {
  IsString,
  IsOptional,
  IsUUID,
  IsArray,
  IsInt,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  JwtAuthGuard,
  RolesGuard,
  Roles,
  CurrentUser,
  Role,
  UserContext,
} from '../../../auth/infrastructure/auth.module.js';
import { CreateCategoryUseCase } from '../../application/use-cases/create-category.use-case.js';
import { ListCategoriesUseCase } from '../../application/use-cases/list-categories.use-case.js';
import { CategoryResponseDto } from '../../application/dtos/post-response.dto.js';
import {
  CATEGORY_REPOSITORY,
  type ICategoryRepository,
} from '../../application/ports/i-post-repository.port.js';
import { Inject } from '@nestjs/common';

class CategoryTranslationDto {
  @IsString()
  @MaxLength(10)
  languageCode!: string;

  @IsString()
  @MaxLength(255)
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;
}

class CreateCategoryDto {
  @IsString()
  @MaxLength(255)
  slug!: string;

  @IsOptional()
  @IsUUID()
  parentId?: string;

  @IsOptional()
  @IsInt()
  order?: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CategoryTranslationDto)
  translations!: CategoryTranslationDto[];
}

class UpdateCategoryDto {
  @IsOptional()
  @IsString()
  @MaxLength(255)
  slug?: string;

  @IsOptional()
  @IsUUID()
  parentId?: string | null;

  @IsOptional()
  @IsInt()
  order?: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CategoryTranslationDto)
  translations?: CategoryTranslationDto[];
}

@Controller('api/v1/categories')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CategoriesController {
  constructor(
    private readonly createCategoryUseCase: CreateCategoryUseCase,
    private readonly listCategoriesUseCase: ListCategoriesUseCase,
    @Inject(CATEGORY_REPOSITORY)
    private readonly categoryRepository: ICategoryRepository,
  ) {}

  @Get()
  @Roles(Role.ADMIN, Role.EDITOR, Role.AUTHOR)
  async list(
    @CurrentUser() user: UserContext,
  ): Promise<{ data: CategoryResponseDto[] }> {
    const categories = await this.listCategoriesUseCase.execute(user.tenantId);
    return { data: categories.map(CategoryResponseDto.fromEntity) };
  }

  @Post()
  @Roles(Role.ADMIN, Role.EDITOR)
  async create(
    @CurrentUser() user: UserContext,
    @Body() dto: CreateCategoryDto,
  ): Promise<{ data: CategoryResponseDto }> {
    const category = await this.createCategoryUseCase.execute({
      tenantId: user.tenantId,
      slug: dto.slug,
      parentId: dto.parentId,
      order: dto.order,
      translations: dto.translations,
    });
    return { data: CategoryResponseDto.fromEntity(category) };
  }

  @Put(':id')
  @Roles(Role.ADMIN, Role.EDITOR)
  async update(
    @CurrentUser() user: UserContext,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateCategoryDto,
  ): Promise<{ data: CategoryResponseDto }> {
    const category = await this.categoryRepository.update(
      user.tenantId,
      id,
      dto,
    );
    return { data: CategoryResponseDto.fromEntity(category) };
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(
    @CurrentUser() user: UserContext,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    await this.categoryRepository.delete(user.tenantId, id);
  }
}
