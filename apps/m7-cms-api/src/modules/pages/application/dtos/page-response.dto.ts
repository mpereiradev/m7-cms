import type {
  PageEntity,
  PageTranslationEntity,
  SectionEntity,
} from '../../domain/entities/page.entity.js';

export class SectionResponseDto {
  id!: string;
  pageId!: string;
  type!: string;
  order!: number;
  content!: unknown;
  createdAt!: string;
  updatedAt!: string;

  static fromEntity(entity: SectionEntity): SectionResponseDto {
    const dto = new SectionResponseDto();
    dto.id = entity.id;
    dto.pageId = entity.pageId;
    dto.type = entity.type;
    dto.order = entity.order;
    dto.content = entity.content;
    dto.createdAt = entity.createdAt.toISOString();
    dto.updatedAt = entity.updatedAt.toISOString();
    return dto;
  }
}

export class PageTranslationResponseDto {
  id!: string;
  languageCode!: string;
  title!: string;
  seoTitle!: string | null;
  seoDescription!: string | null;

  static fromEntity(entity: PageTranslationEntity): PageTranslationResponseDto {
    const dto = new PageTranslationResponseDto();
    dto.id = entity.id;
    dto.languageCode = entity.languageCode;
    dto.title = entity.title;
    dto.seoTitle = entity.seoTitle;
    dto.seoDescription = entity.seoDescription;
    return dto;
  }
}

export class PageResponseDto {
  id!: string;
  tenantId!: string;
  slug!: string;
  status!: string;
  publishedAt!: string | null;
  createdAt!: string;
  updatedAt!: string;
  translations!: PageTranslationResponseDto[];
  sections!: SectionResponseDto[];

  static fromEntity(entity: PageEntity): PageResponseDto {
    const dto = new PageResponseDto();
    dto.id = entity.id;
    dto.tenantId = entity.tenantId;
    dto.slug = entity.slug;
    dto.status = entity.status;
    dto.publishedAt = entity.publishedAt?.toISOString() ?? null;
    dto.createdAt = entity.createdAt.toISOString();
    dto.updatedAt = entity.updatedAt.toISOString();
    dto.translations = entity.translations.map(
      PageTranslationResponseDto.fromEntity,
    );
    dto.sections = entity.sections.map(SectionResponseDto.fromEntity);
    return dto;
  }
}
