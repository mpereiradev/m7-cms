import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  PAGE_REPOSITORY,
  type IPageRepository,
} from '../ports/i-page-repository.port.js';

export interface ReorderSectionsInput {
  pageId: string;
  sectionOrders: { id: string; order: number }[];
}

@Injectable()
export class ReorderSectionsUseCase {
  constructor(
    @Inject(PAGE_REPOSITORY)
    private readonly pageRepository: IPageRepository,
  ) {}

  async execute(tenantId: string, input: ReorderSectionsInput): Promise<void> {
    // Verify the page belongs to the tenant
    const page = await this.pageRepository.findById(tenantId, input.pageId);
    if (!page) {
      throw new NotFoundException('Page not found.');
    }

    await this.pageRepository.updateSectionOrder(
      input.pageId,
      input.sectionOrders,
    );
  }
}
