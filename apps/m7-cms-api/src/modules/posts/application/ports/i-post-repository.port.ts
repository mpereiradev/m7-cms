import type {
  PostEntity,
  CategoryEntity,
  TagEntity,
} from '../../domain/entities/post.entity.js';

export const POST_REPOSITORY = Symbol('POST_REPOSITORY');

export interface ListPostsFilters {
  status?: string;
  categoryId?: string;
  tagId?: string;
}

export interface IPostRepository {
  findById(tenantId: string, id: string): Promise<PostEntity | null>;
  findBySlug(tenantId: string, slug: string): Promise<PostEntity | null>;
  findAll(tenantId: string, filters?: ListPostsFilters): Promise<PostEntity[]>;
  create(data: {
    tenantId: string;
    slug: string;
    authorId: string | null;
    categoryIds?: string[];
    tagIds?: string[];
    translations: {
      languageCode: string;
      title: string;
      summary?: string | null;
      content?: unknown;
    }[];
  }): Promise<PostEntity>;
  update(
    tenantId: string,
    id: string,
    data: {
      slug?: string;
      status?: 'draft' | 'published';
      publishedAt?: Date | null;
      categoryIds?: string[];
      tagIds?: string[];
      translations?: {
        languageCode: string;
        title: string;
        summary?: string | null;
        content?: unknown;
      }[];
    },
  ): Promise<PostEntity | null>;
  delete(tenantId: string, id: string): Promise<boolean>;
}

export const CATEGORY_REPOSITORY = Symbol('CATEGORY_REPOSITORY');

export interface ICategoryRepository {
  findById(tenantId: string, id: string): Promise<CategoryEntity | null>;
  findAll(tenantId: string): Promise<CategoryEntity[]>;
  create(data: {
    tenantId: string;
    slug: string;
    parentId?: string | null;
    order?: number;
    translations: {
      languageCode: string;
      name: string;
      description?: string | null;
    }[];
  }): Promise<CategoryEntity>;
}

export const TAG_REPOSITORY = Symbol('TAG_REPOSITORY');

export interface ITagRepository {
  findById(tenantId: string, id: string): Promise<TagEntity | null>;
  findAll(tenantId: string): Promise<TagEntity[]>;
  create(data: { tenantId: string; slug: string }): Promise<TagEntity>;
}
