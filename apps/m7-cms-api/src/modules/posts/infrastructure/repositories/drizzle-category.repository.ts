import { Injectable } from '@nestjs/common';
import { eq, and } from 'drizzle-orm';
import { db } from '../../../../infrastructure/database/db.js';
import {
  categories,
  categoryTranslations,
} from '../../../../infrastructure/database/schema/index.js';
import type { ICategoryRepository } from '../../application/ports/i-post-repository.port.js';
import {
  CategoryEntity,
  CategoryTranslationEntity,
} from '../../domain/entities/post.entity.js';

@Injectable()
export class DrizzleCategoryRepository implements ICategoryRepository {
  async findById(tenantId: string, id: string): Promise<CategoryEntity | null> {
    const rows = await db
      .select()
      .from(categories)
      .where(and(eq(categories.tenantId, tenantId), eq(categories.id, id)));
    if (rows.length === 0) return null;

    const row = rows[0];
    const trans = await db
      .select()
      .from(categoryTranslations)
      .where(eq(categoryTranslations.categoryId, id));

    return new CategoryEntity({
      ...row,
      parentId: row.parentId ?? null,
      translations: trans.map(
        (t) =>
          new CategoryTranslationEntity({
            ...t,
            description: t.description ?? null,
          }),
      ),
    });
  }

  async findAll(tenantId: string): Promise<CategoryEntity[]> {
    const rows = await db
      .select()
      .from(categories)
      .where(eq(categories.tenantId, tenantId));

    return Promise.all(
      rows.map(async (row) => {
        const trans = await db
          .select()
          .from(categoryTranslations)
          .where(eq(categoryTranslations.categoryId, row.id));

        return new CategoryEntity({
          ...row,
          parentId: row.parentId ?? null,
          translations: trans.map(
            (t) =>
              new CategoryTranslationEntity({
                ...t,
                description: t.description ?? null,
              }),
          ),
        });
      }),
    );
  }

  async create(data: {
    tenantId: string;
    slug: string;
    parentId?: string | null;
    order?: number;
    translations: {
      languageCode: string;
      name: string;
      description?: string | null;
    }[];
  }): Promise<CategoryEntity> {
    const [row] = await db
      .insert(categories)
      .values({
        tenantId: data.tenantId,
        slug: data.slug,
        parentId: data.parentId ?? null,
        order: data.order ?? 0,
      })
      .returning();

    if (data.translations.length > 0) {
      await db.insert(categoryTranslations).values(
        data.translations.map((t) => ({
          categoryId: row.id,
          languageCode: t.languageCode,
          name: t.name,
          description: t.description ?? null,
        })),
      );
    }

    return this.findById(data.tenantId, row.id) as Promise<CategoryEntity>;
  }
}
