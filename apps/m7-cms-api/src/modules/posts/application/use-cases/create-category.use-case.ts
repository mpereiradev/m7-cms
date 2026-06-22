import { Inject, Injectable } from '@nestjs/common';
import type { CategoryEntity } from '../../domain/entities/post.entity.js';
import {
  CATEGORY_REPOSITORY,
  type ICategoryRepository,
} from '../ports/i-post-repository.port.js';

export interface CreateCategoryInput {
  tenantId: string;
  slug: string;
  parentId?: string | null;
  order?: number;
  translations: {
    languageCode: string;
    name: string;
    description?: string | null;
  }[];
}

@Injectable()
export class CreateCategoryUseCase {
  constructor(
    @Inject(CATEGORY_REPOSITORY)
    private readonly categoryRepository: ICategoryRepository,
  ) {}

  async execute(input: CreateCategoryInput): Promise<CategoryEntity> {
    return this.categoryRepository.create(input);
  }
}
