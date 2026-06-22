import type {
  PageEntity,
  SectionEntity,
} from '../../domain/entities/page.entity.js';

export const PAGE_REPOSITORY = Symbol('PAGE_REPOSITORY');

export interface IPageRepository {
  findById(tenantId: string, id: string): Promise<PageEntity | null>;
  findBySlug(tenantId: string, slug: string): Promise<PageEntity | null>;
  findAll(
    tenantId: string,
    filters?: { status?: string },
  ): Promise<PageEntity[]>;
  create(data: {
    tenantId: string;
    slug: string;
    translations: {
      languageCode: string;
      title: string;
      seoTitle?: string | null;
      seoDescription?: string | null;
    }[];
  }): Promise<PageEntity>;
  update(
    tenantId: string,
    id: string,
    data: {
      slug?: string;
      status?: 'draft' | 'published';
      publishedAt?: Date | null;
      translations?: {
        languageCode: string;
        title: string;
        seoTitle?: string | null;
        seoDescription?: string | null;
      }[];
    },
  ): Promise<PageEntity | null>;
  delete(tenantId: string, id: string): Promise<boolean>;

  // Sections
  addSection(data: {
    pageId: string;
    type: string;
    order: number;
    content: unknown;
  }): Promise<SectionEntity>;
  updateSectionOrder(
    pageId: string,
    sectionOrders: { id: string; order: number }[],
  ): Promise<void>;
}
