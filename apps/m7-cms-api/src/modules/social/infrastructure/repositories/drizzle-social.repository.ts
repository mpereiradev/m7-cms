import { Injectable } from '@nestjs/common';
import { eq, and, asc } from 'drizzle-orm';
import { db } from '../../../../infrastructure/database/db.js';
import { socialPosts } from '../../../../infrastructure/database/schema/index.js';
import type { ISocialRepository } from '../../application/ports/i-social-repository.port.js';
import { SocialPostEntity } from '../../domain/entities/social-post.entity.js';

@Injectable()
export class DrizzleSocialRepository implements ISocialRepository {
  private toEntity(row: typeof socialPosts.$inferSelect): SocialPostEntity {
    return new SocialPostEntity({
      id: row.id,
      tenantId: row.tenantId,
      platform: row.platform,
      url: row.url,
      title: row.title,
      publishedAt: row.publishedAt,
      order: row.order,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  }

  async findById(
    tenantId: string,
    id: string,
  ): Promise<SocialPostEntity | null> {
    const rows = await db
      .select()
      .from(socialPosts)
      .where(and(eq(socialPosts.tenantId, tenantId), eq(socialPosts.id, id)))
      .limit(1);

    return rows.length === 0 ? null : this.toEntity(rows[0]);
  }

  async findAll(tenantId: string): Promise<SocialPostEntity[]> {
    const rows = await db
      .select()
      .from(socialPosts)
      .where(eq(socialPosts.tenantId, tenantId))
      .orderBy(asc(socialPosts.order));

    return rows.map((row) => this.toEntity(row));
  }

  async create(data: {
    tenantId: string;
    platform: string;
    url: string;
    title?: string | null;
    publishedAt?: Date | null;
    order?: number;
  }): Promise<SocialPostEntity> {
    const rows = await db
      .insert(socialPosts)
      .values({
        tenantId: data.tenantId,
        platform: data.platform as
          | 'facebook'
          | 'instagram'
          | 'linkedin'
          | 'pinterest'
          | 'tiktok'
          | 'x'
          | 'youtube',
        url: data.url,
        title: data.title ?? null,
        publishedAt: data.publishedAt ?? null,
        order: data.order ?? 0,
      })
      .returning();

    return this.toEntity(rows[0]);
  }

  async update(
    tenantId: string,
    id: string,
    data: {
      platform?: string;
      url?: string;
      title?: string | null;
      publishedAt?: Date | null;
      order?: number;
    },
  ): Promise<SocialPostEntity | null> {
    const updateData: Record<string, unknown> = {
      updatedAt: new Date(),
    };

    if (data.platform !== undefined) updateData.platform = data.platform;
    if (data.url !== undefined) updateData.url = data.url;
    if (data.title !== undefined) updateData.title = data.title;
    if (data.publishedAt !== undefined)
      updateData.publishedAt = data.publishedAt;
    if (data.order !== undefined) updateData.order = data.order;

    const rows = await db
      .update(socialPosts)
      .set(updateData)
      .where(and(eq(socialPosts.tenantId, tenantId), eq(socialPosts.id, id)))
      .returning();

    return rows.length === 0 ? null : this.toEntity(rows[0]);
  }

  async delete(tenantId: string, id: string): Promise<boolean> {
    const rows = await db
      .delete(socialPosts)
      .where(and(eq(socialPosts.tenantId, tenantId), eq(socialPosts.id, id)))
      .returning();

    return rows.length > 0;
  }

  async reorder(tenantId: string, ids: string[]): Promise<SocialPostEntity[]> {
    for (let i = 0; i < ids.length; i++) {
      await db
        .update(socialPosts)
        .set({ order: i, updatedAt: new Date() })
        .where(
          and(eq(socialPosts.tenantId, tenantId), eq(socialPosts.id, ids[i])),
        );
    }

    return this.findAll(tenantId);
  }
}
