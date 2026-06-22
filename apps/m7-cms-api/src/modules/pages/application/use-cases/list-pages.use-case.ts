import { Inject, Injectable } from '@nestjs/common';
import type { PageEntity } from '../../domain/entities/page.entity.js';
import {
  PAGE_REPOSITORY,
  type IPageRepository,
} from '../ports/i-page-repository.port.js';

@Injectable()
export class ListPagesUseCase {
  constructor(
    @Inject(PAGE_REPOSITORY)
    private readonly pageRepository: IPageRepository,
  ) {}

  async execute(
    tenantId: string,
    filters?: { status?: string },
  ): Promise<PageEntity[]> {
    return this.pageRepository.findAll(tenantId, filters);
  }
}
