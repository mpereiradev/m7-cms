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
    status?: string;
    publishedAt?: Date | null;
    authorId: string | null;
    coverMediaId?: string | null;
    categoryIds?: string[];
    tagIds?: string[];
    translations: {
      languageCode: string;
      title: string;
      summary?: string | null;
      content?: unknown;
      seoTitle?: string | null;
      seoDescription?: string | null;
    }[];
  }): Promise<PostEntity>;
  update(
    tenantId: string,
    id: string,
    data: {
      slug?: string;
      status?: 'draft' | 'published';
      publishedAt?: Date | null;
      coverMediaId?: string | null;
      categoryIds?: string[];
      tagIds?: string[];
      translations?: {
        languageCode: string;
        title: string;
        summary?: string | null;
        content?: unknown;
        seoTitle?: string | null;
        seoDescription?: string | null;
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
  update(
    tenantId: string,
    id: string,
    data: {
      slug?: string;
      parentId?: string | null;
      order?: number;
      translations?: {
        languageCode: string;
        name: string;
        description?: string | null;
      }[];
    },
  ): Promise<CategoryEntity>;
  delete(tenantId: string, id: string): Promise<void>;
}

export const TAG_REPOSITORY = Symbol('TAG_REPOSITORY');

export interface ITagRepository {
  findById(tenantId: string, id: string): Promise<TagEntity | null>;
  findAll(tenantId: string): Promise<TagEntity[]>;
  create(data: {
    tenantId: string;
    name: string;
    slug: string;
  }): Promise<TagEntity>;
  delete(tenantId: string, id: string): Promise<void>;
}
