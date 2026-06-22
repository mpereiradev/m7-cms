export class SectionEntity {
  readonly id: string;
  readonly pageId: string;
  readonly type: string;
  readonly order: number;
  readonly content: unknown;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  constructor(props: {
    id: string;
    pageId: string;
    type: string;
    order: number;
    content: unknown;
    createdAt: Date;
    updatedAt: Date;
  }) {
    this.id = props.id;
    this.pageId = props.pageId;
    this.type = props.type;
    this.order = props.order;
    this.content = props.content;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }
}

export class PageTranslationEntity {
  readonly id: string;
  readonly pageId: string;
  readonly languageCode: string;
  readonly title: string;
  readonly seoTitle: string | null;
  readonly seoDescription: string | null;

  constructor(props: {
    id: string;
    pageId: string;
    languageCode: string;
    title: string;
    seoTitle: string | null;
    seoDescription: string | null;
  }) {
    this.id = props.id;
    this.pageId = props.pageId;
    this.languageCode = props.languageCode;
    this.title = props.title;
    this.seoTitle = props.seoTitle;
    this.seoDescription = props.seoDescription;
  }
}

export type PageStatus = 'draft' | 'published';

export class PageEntity {
  readonly id: string;
  readonly tenantId: string;
  readonly slug: string;
  readonly status: PageStatus;
  readonly publishedAt: Date | null;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly translations: PageTranslationEntity[];
  readonly sections: SectionEntity[];

  constructor(props: {
    id: string;
    tenantId: string;
    slug: string;
    status: PageStatus;
    publishedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
    translations?: PageTranslationEntity[];
    sections?: SectionEntity[];
  }) {
    this.id = props.id;
    this.tenantId = props.tenantId;
    this.slug = props.slug;
    this.status = props.status;
    this.publishedAt = props.publishedAt;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
    this.translations = props.translations ?? [];
    this.sections = props.sections ?? [];
  }

  isPublished(): boolean {
    return this.status === 'published';
  }
}
