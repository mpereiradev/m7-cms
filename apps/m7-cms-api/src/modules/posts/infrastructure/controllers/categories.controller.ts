import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
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

class CreateCategoryDto {
  slug!: string;
  parentId?: string;
  order?: number;
  translations!: { languageCode: string; name: string; description?: string }[];
}

@Controller('api/v1/categories')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CategoriesController {
  constructor(
    private readonly createCategoryUseCase: CreateCategoryUseCase,
    private readonly listCategoriesUseCase: ListCategoriesUseCase,
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
}
