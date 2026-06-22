import type {
  PostEntity,
  PostTranslationEntity,
  CategoryEntity,
  CategoryTranslationEntity,
  TagEntity,
} from '../../domain/entities/post.entity.js';

export class PostTranslationResponseDto {
  id!: string;
  languageCode!: string;
  title!: string;
  summary!: string | null;
  content!: unknown;

  static fromEntity(entity: PostTranslationEntity): PostTranslationResponseDto {
    const dto = new PostTranslationResponseDto();
    dto.id = entity.id;
    dto.languageCode = entity.languageCode;
    dto.title = entity.title;
    dto.summary = entity.summary;
    dto.content = entity.content;
    return dto;
  }
}

export class PostResponseDto {
  id!: string;
  tenantId!: string;
  slug!: string;
  status!: string;
  publishedAt!: string | null;
  authorId!: string | null;
  createdAt!: string;
  updatedAt!: string;
  translations!: PostTranslationResponseDto[];
  categoryIds!: string[];
  tagIds!: string[];

  static fromEntity(entity: PostEntity): PostResponseDto {
    const dto = new PostResponseDto();
    dto.id = entity.id;
    dto.tenantId = entity.tenantId;
    dto.slug = entity.slug;
    dto.status = entity.status;
    dto.publishedAt = entity.publishedAt?.toISOString() ?? null;
    dto.authorId = entity.authorId;
    dto.createdAt = entity.createdAt.toISOString();
    dto.updatedAt = entity.updatedAt.toISOString();
    dto.translations = entity.translations.map(
      PostTranslationResponseDto.fromEntity,
    );
    dto.categoryIds = entity.categoryIds;
    dto.tagIds = entity.tagIds;
    return dto;
  }
}

export class CategoryTranslationResponseDto {
  id!: string;
  languageCode!: string;
  name!: string;
  description!: string | null;

  static fromEntity(
    entity: CategoryTranslationEntity,
  ): CategoryTranslationResponseDto {
    const dto = new CategoryTranslationResponseDto();
    dto.id = entity.id;
    dto.languageCode = entity.languageCode;
    dto.name = entity.name;
    dto.description = entity.description;
    return dto;
  }
}

export class CategoryResponseDto {
  id!: string;
  tenantId!: string;
  parentId!: string | null;
  slug!: string;
  order!: number;
  createdAt!: string;
  updatedAt!: string;
  translations!: CategoryTranslationResponseDto[];

  static fromEntity(entity: CategoryEntity): CategoryResponseDto {
    const dto = new CategoryResponseDto();
    dto.id = entity.id;
    dto.tenantId = entity.tenantId;
    dto.parentId = entity.parentId;
    dto.slug = entity.slug;
    dto.order = entity.order;
    dto.createdAt = entity.createdAt.toISOString();
    dto.updatedAt = entity.updatedAt.toISOString();
    dto.translations = entity.translations.map(
      CategoryTranslationResponseDto.fromEntity,
    );
    return dto;
  }
}

export class TagResponseDto {
  id!: string;
  tenantId!: string;
  slug!: string;
  createdAt!: string;
  updatedAt!: string;

  static fromEntity(entity: TagEntity): TagResponseDto {
    const dto = new TagResponseDto();
    dto.id = entity.id;
    dto.tenantId = entity.tenantId;
    dto.slug = entity.slug;
    dto.createdAt = entity.createdAt.toISOString();
    dto.updatedAt = entity.updatedAt.toISOString();
    return dto;
  }
}
