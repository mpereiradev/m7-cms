export class PostTranslationEntity {
  readonly id: string;
  readonly postId: string;
  readonly languageCode: string;
  readonly title: string;
  readonly summary: string | null;
  readonly content: unknown;

  constructor(props: {
    id: string;
    postId: string;
    languageCode: string;
    title: string;
    summary: string | null;
    content: unknown;
  }) {
    this.id = props.id;
    this.postId = props.postId;
    this.languageCode = props.languageCode;
    this.title = props.title;
    this.summary = props.summary;
    this.content = props.content;
  }
}

export type PostStatus = 'draft' | 'published';

export class PostEntity {
  readonly id: string;
  readonly tenantId: string;
  readonly slug: string;
  readonly status: PostStatus;
  readonly publishedAt: Date | null;
  readonly authorId: string | null;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly translations: PostTranslationEntity[];
  readonly categoryIds: string[];
  readonly tagIds: string[];

  constructor(props: {
    id: string;
    tenantId: string;
    slug: string;
    status: PostStatus;
    publishedAt: Date | null;
    authorId: string | null;
    createdAt: Date;
    updatedAt: Date;
    translations?: PostTranslationEntity[];
    categoryIds?: string[];
    tagIds?: string[];
  }) {
    this.id = props.id;
    this.tenantId = props.tenantId;
    this.slug = props.slug;
    this.status = props.status;
    this.publishedAt = props.publishedAt;
    this.authorId = props.authorId;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
    this.translations = props.translations ?? [];
    this.categoryIds = props.categoryIds ?? [];
    this.tagIds = props.tagIds ?? [];
  }

  isPublished(): boolean {
    return this.status === 'published';
  }

  isScheduled(): boolean {
    return this.publishedAt !== null && this.publishedAt.getTime() > Date.now();
  }
}

export class CategoryTranslationEntity {
  readonly id: string;
  readonly categoryId: string;
  readonly languageCode: string;
  readonly name: string;
  readonly description: string | null;

  constructor(props: {
    id: string;
    categoryId: string;
    languageCode: string;
    name: string;
    description: string | null;
  }) {
    this.id = props.id;
    this.categoryId = props.categoryId;
    this.languageCode = props.languageCode;
    this.name = props.name;
    this.description = props.description;
  }
}

export class CategoryEntity {
  readonly id: string;
  readonly tenantId: string;
  readonly parentId: string | null;
  readonly slug: string;
  readonly order: number;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly translations: CategoryTranslationEntity[];

  constructor(props: {
    id: string;
    tenantId: string;
    parentId: string | null;
    slug: string;
    order: number;
    createdAt: Date;
    updatedAt: Date;
    translations?: CategoryTranslationEntity[];
  }) {
    this.id = props.id;
    this.tenantId = props.tenantId;
    this.parentId = props.parentId;
    this.slug = props.slug;
    this.order = props.order;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
    this.translations = props.translations ?? [];
  }
}

export class TagEntity {
  readonly id: string;
  readonly tenantId: string;
  readonly slug: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  constructor(props: {
    id: string;
    tenantId: string;
    slug: string;
    createdAt: Date;
    updatedAt: Date;
  }) {
    this.id = props.id;
    this.tenantId = props.tenantId;
    this.slug = props.slug;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }
}
