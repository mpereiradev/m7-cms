import { Injectable } from '@nestjs/common';
import { eq, and, lte, gte, sql } from 'drizzle-orm';
import { db } from '../../../../infrastructure/database/db.js';
import { banners } from '../../../../infrastructure/database/schema/index.js';
import type { IBannerRepository } from '../../application/ports/i-banner-repository.port.js';
import { BannerEntity } from '../../domain/entities/banner.entity.js';

@Injectable()
export class DrizzleBannerRepository implements IBannerRepository {
  private toEntity(row: typeof banners.$inferSelect): BannerEntity {
    return new BannerEntity({
      id: row.id,
      tenantId: row.tenantId,
      title: row.title ?? null,
      mediaId: row.mediaId ?? null,
      ctaLabel: row.ctaLabel ?? null,
      linkUrl: row.linkUrl ?? null,
      displayStart: row.displayStart ?? null,
      displayEnd: row.displayEnd ?? null,
      order: row.order,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  }

  async findById(tenantId: string, id: string): Promise<BannerEntity | null> {
    const rows = await db
      .select()
      .from(banners)
      .where(and(eq(banners.tenantId, tenantId), eq(banners.id, id)));
    return rows.length > 0 ? this.toEntity(rows[0]) : null;
  }

  async findAll(tenantId: string): Promise<BannerEntity[]> {
    const rows = await db
      .select()
      .from(banners)
      .where(eq(banners.tenantId, tenantId));
    return rows.map(this.toEntity);
  }

  async findActive(tenantId: string): Promise<BannerEntity[]> {
    const now = new Date();
    const rows = await db
      .select()
      .from(banners)
      .where(
        and(
          eq(banners.tenantId, tenantId),
          sql`(${banners.displayStart} IS NULL OR ${banners.displayStart} <= ${now})`,
          sql`(${banners.displayEnd} IS NULL OR ${banners.displayEnd} >= ${now})`,
        ),
      );
    return rows.map(this.toEntity);
  }

  async create(data: {
    tenantId: string;
    title?: string | null;
    mediaId?: string | null;
    ctaLabel?: string | null;
    linkUrl?: string | null;
    displayStart?: Date | null;
    displayEnd?: Date | null;
    order?: number;
  }): Promise<BannerEntity> {
    const [row] = await db
      .insert(banners)
      .values({
        tenantId: data.tenantId,
        title: data.title ?? null,
        mediaId: data.mediaId ?? null,
        ctaLabel: data.ctaLabel ?? null,
        linkUrl: data.linkUrl ?? null,
        displayStart: data.displayStart ?? null,
        displayEnd: data.displayEnd ?? null,
        order: data.order ?? 0,
      })
      .returning();
    return this.toEntity(row);
  }

  async update(
    tenantId: string,
    id: string,
    data: {
      title?: string | null;
      mediaId?: string | null;
      ctaLabel?: string | null;
      linkUrl?: string | null;
      displayStart?: Date | null;
      displayEnd?: Date | null;
      order?: number;
    },
  ): Promise<BannerEntity | null> {
    const updateData: any = { updatedAt: new Date() };
    if (data.title !== undefined) updateData.title = data.title;
    if (data.mediaId !== undefined) updateData.mediaId = data.mediaId;
    if (data.ctaLabel !== undefined) updateData.ctaLabel = data.ctaLabel;
    if (data.linkUrl !== undefined) updateData.linkUrl = data.linkUrl;
    if (data.displayStart !== undefined)
      updateData.displayStart = data.displayStart;
    if (data.displayEnd !== undefined) updateData.displayEnd = data.displayEnd;
    if (data.order !== undefined) updateData.order = data.order;

    const [row] = await db
      .update(banners)
      .set(updateData)
      .where(and(eq(banners.tenantId, tenantId), eq(banners.id, id)))
      .returning();
    return row ? this.toEntity(row) : null;
  }

  async delete(tenantId: string, id: string): Promise<boolean> {
    await db
      .delete(banners)
      .where(and(eq(banners.tenantId, tenantId), eq(banners.id, id)));
    return true;
  }
}
