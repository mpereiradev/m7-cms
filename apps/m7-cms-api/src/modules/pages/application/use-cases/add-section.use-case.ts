import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { SectionEntity } from '../../domain/entities/page.entity.js';
import {
  PAGE_REPOSITORY,
  type IPageRepository,
} from '../ports/i-page-repository.port.js';

export interface AddSectionInput {
  pageId: string;
  type: string;
  order: number;
  content: unknown;
}

@Injectable()
export class AddSectionUseCase {
  constructor(
    @Inject(PAGE_REPOSITORY)
    private readonly pageRepository: IPageRepository,
  ) {}

  async execute(
    tenantId: string,
    input: AddSectionInput,
  ): Promise<SectionEntity> {
    // Verify the page belongs to the tenant
    const page = await this.pageRepository.findById(tenantId, input.pageId);
    if (!page) {
      throw new NotFoundException('Page not found.');
    }

    return this.pageRepository.addSection(input);
  }
}
