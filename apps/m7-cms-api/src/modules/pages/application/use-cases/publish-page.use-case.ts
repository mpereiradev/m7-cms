import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { PageEntity } from '../../domain/entities/page.entity.js';
import {
  PAGE_REPOSITORY,
  type IPageRepository,
} from '../ports/i-page-repository.port.js';

@Injectable()
export class PublishPageUseCase {
  constructor(
    @Inject(PAGE_REPOSITORY)
    private readonly pageRepository: IPageRepository,
  ) {}

  async execute(tenantId: string, id: string): Promise<PageEntity> {
    const page = await this.pageRepository.update(tenantId, id, {
      status: 'published',
      publishedAt: new Date(),
    });
    if (!page) {
      throw new NotFoundException('Page not found.');
    }
    return page;
  }
}
