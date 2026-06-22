import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { PageEntity } from '../../domain/entities/page.entity.js';
import {
  PAGE_REPOSITORY,
  type IPageRepository,
} from '../ports/i-page-repository.port.js';

@Injectable()
export class GetPageUseCase {
  constructor(
    @Inject(PAGE_REPOSITORY)
    private readonly pageRepository: IPageRepository,
  ) {}

  async execute(tenantId: string, id: string): Promise<PageEntity> {
    const page = await this.pageRepository.findById(tenantId, id);
    if (!page) {
      throw new NotFoundException('Page not found.');
    }
    return page;
  }

  async executeBySlug(tenantId: string, slug: string): Promise<PageEntity> {
    const page = await this.pageRepository.findBySlug(tenantId, slug);
    if (!page) {
      throw new NotFoundException('Page not found.');
    }
    return page;
  }
}
