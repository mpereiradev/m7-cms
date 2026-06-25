import { Injectable } from '@nestjs/common';
import { eq, and, inArray } from 'drizzle-orm';
import { db } from '../../../../infrastructure/database/db.js';
import {
  posts,
  postTranslations,
  postTags,
  categories,
  categoryTranslations,
  tags,
} from '../../../../infrastructure/database/schema/index.js';
import type {
  IPostRepository,
  ListPostsFilters,
} from '../../application/ports/i-post-repository.port.js';
import {
  PostEntity,
  PostTranslationEntity,
} from '../../domain/entities/post.entity.js';

@Injectable()
export class DrizzlePostRepository implements IPostRepository {
  async findById(tenantId: string, id: string): Promise<PostEntity | null> {
    const rows = await db
      .select()
      .from(posts)
      .where(and(eq(posts.tenantId, tenantId), eq(posts.id, id)));
    if (rows.length === 0) return null;

    const row = rows[0];
    const trans = await db
      .select()
      .from(postTranslations)
      .where(eq(postTranslations.postId, id));
    const tagRows = await db
      .select()
      .from(postTags)
      .where(eq(postTags.postId, id));

    return new PostEntity({
      ...row,
      translations: trans.map(
        (t) =>
          new PostTranslationEntity({
            ...t,
            summary: t.summary ?? null,
            content: t.content,
          }),
      ),
      tagIds: tagRows.map((t) => t.tagId),
      categoryIds: [],
    });
  }

  async findBySlug(tenantId: string, slug: string): Promise<PostEntity | null> {
    const rows = await db
      .select()
      .from(posts)
      .where(and(eq(posts.tenantId, tenantId), eq(posts.slug, slug)));
    if (rows.length === 0) return null;

    const row = rows[0];
    const trans = await db
      .select()
      .from(postTranslations)
      .where(eq(postTranslations.postId, row.id));
    const tagRows = await db
      .select()
      .from(postTags)
      .where(eq(postTags.postId, row.id));

    return new PostEntity({
      ...row,
      translations: trans.map(
        (t) =>
          new PostTranslationEntity({
            ...t,
            summary: t.summary ?? null,
            content: t.content,
          }),
      ),
      tagIds: tagRows.map((t) => t.tagId),
      categoryIds: [],
    });
  }

  async findAll(
    tenantId: string,
    filters?: ListPostsFilters,
  ): Promise<PostEntity[]> {
    let query = db
      .select()
      .from(posts)
      .where(eq(posts.tenantId, tenantId))
      .$dynamic();

    if (filters?.status) {
      query = query.where(
        and(
          eq(posts.tenantId, tenantId),
          eq(posts.status, filters.status as any),
        ),
      );
    }

    const rows = await query;

    return Promise.all(
      rows.map(async (row) => {
        const trans = await db
          .select()
          .from(postTranslations)
          .where(eq(postTranslations.postId, row.id));
        const tagRows = await db
          .select()
          .from(postTags)
          .where(eq(postTags.postId, row.id));

        return new PostEntity({
          ...row,
          translations: trans.map(
            (t) =>
              new PostTranslationEntity({
                ...t,
                summary: t.summary ?? null,
                content: t.content,
              }),
          ),
          tagIds: tagRows.map((t) => t.tagId),
          categoryIds: [],
        });
      }),
    );
  }

  async create(data: {
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
  }): Promise<PostEntity> {
    const [row] = await db
      .insert(posts)
      .values({
        tenantId: data.tenantId,
        slug: data.slug,
        status: (data.status as any) ?? 'draft',
        publishedAt: data.publishedAt ?? null,
        authorId: data.authorId,
        coverMediaId: data.coverMediaId ?? null,
      })
      .returning();

    if (data.translations.length > 0) {
      await db.insert(postTranslations).values(
        data.translations.map((t) => ({
          postId: row.id,
          languageCode: t.languageCode,
          title: t.title,
          summary: t.summary ?? null,
          content: t.content ?? null,
          seoTitle: t.seoTitle ?? null,
          seoDescription: t.seoDescription ?? null,
        })),
      );
    }

    if (data.tagIds && data.tagIds.length > 0) {
      await db
        .insert(postTags)
        .values(data.tagIds.map((tagId) => ({ postId: row.id, tagId })));
    }

    return this.findById(data.tenantId, row.id) as Promise<PostEntity>;
  }

  async update(
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
  ): Promise<PostEntity | null> {
    const existing = await this.findById(tenantId, id);
    if (!existing) return null;

    const updateData: any = { updatedAt: new Date() };
    if (data.slug) updateData.slug = data.slug;
    if (data.status) updateData.status = data.status;
    if (data.publishedAt !== undefined)
      updateData.publishedAt = data.publishedAt;
    if (data.coverMediaId !== undefined)
      updateData.coverMediaId = data.coverMediaId;

    await db
      .update(posts)
      .set(updateData)
      .where(and(eq(posts.tenantId, tenantId), eq(posts.id, id)));

    if (data.translations) {
      await db.delete(postTranslations).where(eq(postTranslations.postId, id));
      if (data.translations.length > 0) {
        await db.insert(postTranslations).values(
          data.translations.map((t) => ({
            postId: id,
            languageCode: t.languageCode,
            title: t.title,
            summary: t.summary ?? null,
            content: t.content ?? null,
            seoTitle: t.seoTitle ?? null,
            seoDescription: t.seoDescription ?? null,
          })),
        );
      }
    }

    if (data.tagIds) {
      await db.delete(postTags).where(eq(postTags.postId, id));
      if (data.tagIds.length > 0) {
        await db
          .insert(postTags)
          .values(data.tagIds.map((tagId) => ({ postId: id, tagId })));
      }
    }

    return this.findById(tenantId, id);
  }

  async delete(tenantId: string, id: string): Promise<boolean> {
    const result = await db
      .delete(posts)
      .where(and(eq(posts.tenantId, tenantId), eq(posts.id, id)));
    return true;
  }
}
