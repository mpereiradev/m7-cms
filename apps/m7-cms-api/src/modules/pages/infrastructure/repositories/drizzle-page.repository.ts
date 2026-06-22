import { Injectable } from '@nestjs/common';
import { eq, and } from 'drizzle-orm';
import { db } from '../../../../infrastructure/database/db.js';
import {
  pages,
  pageTranslations,
  sections,
} from '../../../../infrastructure/database/schema/index.js';
import type { IPageRepository } from '../../application/ports/i-page-repository.port.js';
import {
  PageEntity,
  PageTranslationEntity,
  SectionEntity,
} from '../../domain/entities/page.entity.js';

@Injectable()
export class DrizzlePageRepository implements IPageRepository {
  private toSectionEntity(row: typeof sections.$inferSelect): SectionEntity {
    return new SectionEntity({
      id: row.id,
      pageId: row.pageId,
      type: row.type,
      order: row.order,
      content: row.content,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  }

  private toTranslationEntity(
    row: typeof pageTranslations.$inferSelect,
  ): PageTranslationEntity {
    return new PageTranslationEntity({
      id: row.id,
      pageId: row.pageId,
      languageCode: row.languageCode,
      title: row.title,
      seoTitle: row.seoTitle ?? null,
      seoDescription: row.seoDescription ?? null,
    });
  }

  private toEntity(
    row: typeof pages.$inferSelect,
    translationRows: (typeof pageTranslations.$inferSelect)[] = [],
    sectionRows: (typeof sections.$inferSelect)[] = [],
  ): PageEntity {
    return new PageEntity({
      id: row.id,
      tenantId: row.tenantId,
      slug: row.slug,
      status: row.status,
      publishedAt: row.publishedAt,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      translations: translationRows.map((t) => this.toTranslationEntity(t)),
      sections: sectionRows.map((s) => this.toSectionEntity(s)),
    });
  }

  async findById(tenantId: string, id: string): Promise<PageEntity | null> {
    const rows = await db
      .select()
      .from(pages)
      .where(and(eq(pages.id, id), eq(pages.tenantId, tenantId)))
      .limit(1);

    if (rows.length === 0) {
      return null;
    }

    const translationRows = await db
      .select()
      .from(pageTranslations)
      .where(eq(pageTranslations.pageId, id));

    const sectionRows = await db
      .select()
      .from(sections)
      .where(eq(sections.pageId, id))
      .orderBy(sections.order);

    return this.toEntity(rows[0], translationRows, sectionRows);
  }

  async findBySlug(tenantId: string, slug: string): Promise<PageEntity | null> {
    const rows = await db
      .select()
      .from(pages)
      .where(and(eq(pages.slug, slug), eq(pages.tenantId, tenantId)))
      .limit(1);

    if (rows.length === 0) {
      return null;
    }

    const page = rows[0];

    const translationRows = await db
      .select()
      .from(pageTranslations)
      .where(eq(pageTranslations.pageId, page.id));

    const sectionRows = await db
      .select()
      .from(sections)
      .where(eq(sections.pageId, page.id))
      .orderBy(sections.order);

    return this.toEntity(page, translationRows, sectionRows);
  }

  async findAll(
    tenantId: string,
    filters?: { status?: string },
  ): Promise<PageEntity[]> {
    const conditions = [eq(pages.tenantId, tenantId)];

    if (filters?.status) {
      conditions.push(
        eq(pages.status, filters.status as 'draft' | 'published'),
      );
    }

    const rows = await db
      .select()
      .from(pages)
      .where(and(...conditions));

    const result: PageEntity[] = [];
    for (const row of rows) {
      const translationRows = await db
        .select()
        .from(pageTranslations)
        .where(eq(pageTranslations.pageId, row.id));

      result.push(this.toEntity(row, translationRows, []));
    }

    return result;
  }

  async create(data: {
    tenantId: string;
    slug: string;
    translations: {
      languageCode: string;
      title: string;
      seoTitle?: string | null;
      seoDescription?: string | null;
    }[];
  }): Promise<PageEntity> {
    const pageRows = await db
      .insert(pages)
      .values({
        tenantId: data.tenantId,
        slug: data.slug,
      })
      .returning();

    const page = pageRows[0];

    const translationRows: (typeof pageTranslations.$inferSelect)[] = [];
    for (const t of data.translations) {
      const tRows = await db
        .insert(pageTranslations)
        .values({
          pageId: page.id,
          languageCode: t.languageCode,
          title: t.title,
          seoTitle: t.seoTitle ?? null,
          seoDescription: t.seoDescription ?? null,
        })
        .returning();
      translationRows.push(tRows[0]);
    }

    return this.toEntity(page, translationRows, []);
  }

  async update(
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
  ): Promise<PageEntity | null> {
    // Verify ownership
    const existing = await db
      .select()
      .from(pages)
      .where(and(eq(pages.id, id), eq(pages.tenantId, tenantId)))
      .limit(1);

    if (existing.length === 0) {
      return null;
    }

    const updateData: Record<string, unknown> = {
      updatedAt: new Date(),
    };
    if (data.slug !== undefined) updateData.slug = data.slug;
    if (data.status !== undefined) updateData.status = data.status;
    if (data.publishedAt !== undefined)
      updateData.publishedAt = data.publishedAt;

    const pageRows = await db
      .update(pages)
      .set(updateData)
      .where(and(eq(pages.id, id), eq(pages.tenantId, tenantId)))
      .returning();

    // Update translations if provided
    if (data.translations) {
      // Delete existing translations and re-insert
      await db.delete(pageTranslations).where(eq(pageTranslations.pageId, id));

      for (const t of data.translations) {
        await db.insert(pageTranslations).values({
          pageId: id,
          languageCode: t.languageCode,
          title: t.title,
          seoTitle: t.seoTitle ?? null,
          seoDescription: t.seoDescription ?? null,
        });
      }
    }

    // Fetch full entity
    return this.findById(tenantId, pageRows[0].id);
  }

  async delete(tenantId: string, id: string): Promise<boolean> {
    const rows = await db
      .delete(pages)
      .where(and(eq(pages.id, id), eq(pages.tenantId, tenantId)))
      .returning();

    return rows.length > 0;
  }

  async addSection(data: {
    pageId: string;
    type: string;
    order: number;
    content: unknown;
  }): Promise<SectionEntity> {
    const rows = await db
      .insert(sections)
      .values({
        pageId: data.pageId,
        type: data.type,
        order: data.order,
        content: data.content,
      })
      .returning();

    return this.toSectionEntity(rows[0]);
  }

  async updateSectionOrder(
    pageId: string,
    sectionOrders: { id: string; order: number }[],
  ): Promise<void> {
    for (const item of sectionOrders) {
      await db
        .update(sections)
        .set({ order: item.order, updatedAt: new Date() })
        .where(and(eq(sections.id, item.id), eq(sections.pageId, pageId)));
    }
  }
}
