import { Inject, Injectable } from '@nestjs/common';
import type { CategoryEntity } from '../../domain/entities/post.entity.js';
import {
  CATEGORY_REPOSITORY,
  type ICategoryRepository,
} from '../ports/i-post-repository.port.js';

@Injectable()
export class ListCategoriesUseCase {
  constructor(
    @Inject(CATEGORY_REPOSITORY)
    private readonly categoryRepository: ICategoryRepository,
  ) {}

  async execute(tenantId: string): Promise<CategoryEntity[]> {
    return this.categoryRepository.findAll(tenantId);
  }
}
