import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { PageEntity } from '../../domain/entities/page.entity.js';
import {
  PAGE_REPOSITORY,
  type IPageRepository,
} from '../ports/i-page-repository.port.js';

export interface UpdatePageInput {
  slug?: string;
  translations?: {
    languageCode: string;
    title: string;
    seoTitle?: string | null;
    seoDescription?: string | null;
  }[];
}

@Injectable()
export class UpdatePageUseCase {
  constructor(
    @Inject(PAGE_REPOSITORY)
    private readonly pageRepository: IPageRepository,
  ) {}

  async execute(
    tenantId: string,
    id: string,
    input: UpdatePageInput,
  ): Promise<PageEntity> {
    const page = await this.pageRepository.update(tenantId, id, input);
    if (!page) {
      throw new NotFoundException('Page not found.');
    }
    return page;
  }
}
