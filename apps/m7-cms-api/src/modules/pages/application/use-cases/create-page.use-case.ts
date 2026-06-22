import { Inject, Injectable } from '@nestjs/common';
import type { PageEntity } from '../../domain/entities/page.entity.js';
import {
  PAGE_REPOSITORY,
  type IPageRepository,
} from '../ports/i-page-repository.port.js';

export interface CreatePageInput {
  tenantId: string;
  slug: string;
  translations: {
    languageCode: string;
    title: string;
    seoTitle?: string | null;
    seoDescription?: string | null;
  }[];
}

@Injectable()
export class CreatePageUseCase {
  constructor(
    @Inject(PAGE_REPOSITORY)
    private readonly pageRepository: IPageRepository,
  ) {}

  async execute(input: CreatePageInput): Promise<PageEntity> {
    return this.pageRepository.create(input);
  }
}
