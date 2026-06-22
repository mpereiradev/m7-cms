import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  PAGE_REPOSITORY,
  type IPageRepository,
} from '../ports/i-page-repository.port.js';

@Injectable()
export class DeletePageUseCase {
  constructor(
    @Inject(PAGE_REPOSITORY)
    private readonly pageRepository: IPageRepository,
  ) {}

  async execute(tenantId: string, id: string): Promise<void> {
    const deleted = await this.pageRepository.delete(tenantId, id);
    if (!deleted) {
      throw new NotFoundException('Page not found.');
    }
  }
}
