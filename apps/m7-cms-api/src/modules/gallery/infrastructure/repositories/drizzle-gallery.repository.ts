import { Injectable } from '@nestjs/common';
import { eq, and, asc } from 'drizzle-orm';
import { db } from '../../../../infrastructure/database/db.js';
import {
  galleries,
  galleryItems,
  videos,
} from '../../../../infrastructure/database/schema/index.js';
import type { IGalleryRepository } from '../../application/ports/i-gallery-repository.port.js';
import { GalleryEntity } from '../../domain/entities/gallery.entity.js';
import { GalleryItemEntity } from '../../domain/entities/gallery-item.entity.js';
import { VideoEntity } from '../../domain/entities/video.entity.js';

@Injectable()
export class DrizzleGalleryRepository implements IGalleryRepository {
  // ── Mappers ────────────────────────────────────────────────────────

  private toGalleryEntity(row: typeof galleries.$inferSelect): GalleryEntity {
    return new GalleryEntity({
      id: row.id,
      tenantId: row.tenantId,
      slug: row.slug,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  }

  private toGalleryItemEntity(
    row: typeof galleryItems.$inferSelect,
  ): GalleryItemEntity {
    return new GalleryItemEntity({
      id: row.id,
      galleryId: row.galleryId,
      mediaId: row.mediaId,
      order: row.order,
      caption: row.caption as Record<string, string> | null,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  }

  private toVideoEntity(row: typeof videos.$inferSelect): VideoEntity {
    return new VideoEntity({
      id: row.id,
      tenantId: row.tenantId,
      sourceType: row.sourceType,
      url: row.url,
      title: row.title,
      description: row.description as Record<string, string> | null,
      thumbnailMediaId: row.thumbnailMediaId,
      order: row.order,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  }

  // ── Galleries ──────────────────────────────────────────────────────

  async findGalleryById(
    tenantId: string,
    id: string,
  ): Promise<GalleryEntity | null> {
    const rows = await db
      .select()
      .from(galleries)
      .where(and(eq(galleries.tenantId, tenantId), eq(galleries.id, id)))
      .limit(1);

    return rows.length === 0 ? null : this.toGalleryEntity(rows[0]);
  }

  async findAllGalleries(tenantId: string): Promise<GalleryEntity[]> {
    const rows = await db
      .select()
      .from(galleries)
      .where(eq(galleries.tenantId, tenantId))
      .orderBy(asc(galleries.slug));

    return rows.map((row) => this.toGalleryEntity(row));
  }

  async createGallery(data: {
    tenantId: string;
    slug: string;
    title?: string;
    type?: string;
  }): Promise<GalleryEntity> {
    const rows = await db
      .insert(galleries)
      .values({
        tenantId: data.tenantId,
        slug: data.slug,
      })
      .returning();

    const entity = this.toGalleryEntity(rows[0]);
    return new GalleryEntity({
      ...entity,
      title: data.title ?? null,
      type: data.type ?? 'image',
    });
  }

  async deleteGallery(tenantId: string, id: string): Promise<boolean> {
    const rows = await db
      .delete(galleries)
      .where(and(eq(galleries.tenantId, tenantId), eq(galleries.id, id)))
      .returning();

    return rows.length > 0;
  }

  // ── Gallery Items ──────────────────────────────────────────────────

  async findGalleryItemById(
    galleryId: string,
    id: string,
  ): Promise<GalleryItemEntity | null> {
    const rows = await db
      .select()
      .from(galleryItems)
      .where(
        and(eq(galleryItems.galleryId, galleryId), eq(galleryItems.id, id)),
      )
      .limit(1);

    return rows.length === 0 ? null : this.toGalleryItemEntity(rows[0]);
  }

  async findGalleryItems(galleryId: string): Promise<GalleryItemEntity[]> {
    const rows = await db
      .select()
      .from(galleryItems)
      .where(eq(galleryItems.galleryId, galleryId))
      .orderBy(asc(galleryItems.order));

    return rows.map((row) => this.toGalleryItemEntity(row));
  }

  async addGalleryItem(data: {
    galleryId: string;
    mediaId: string;
    order: number;
    caption?: Record<string, string> | null;
  }): Promise<GalleryItemEntity> {
    const rows = await db
      .insert(galleryItems)
      .values({
        galleryId: data.galleryId,
        mediaId: data.mediaId,
        order: data.order,
        caption: data.caption ?? null,
      })
      .returning();

    return this.toGalleryItemEntity(rows[0]);
  }

  async deleteGalleryItem(galleryId: string, id: string): Promise<boolean> {
    const rows = await db
      .delete(galleryItems)
      .where(
        and(eq(galleryItems.galleryId, galleryId), eq(galleryItems.id, id)),
      )
      .returning();

    return rows.length > 0;
  }

  async reorderGalleryItems(
    galleryId: string,
    ids: string[],
  ): Promise<GalleryItemEntity[]> {
    for (let i = 0; i < ids.length; i++) {
      await db
        .update(galleryItems)
        .set({ order: i, updatedAt: new Date() })
        .where(
          and(
            eq(galleryItems.galleryId, galleryId),
            eq(galleryItems.id, ids[i]),
          ),
        );
    }

    return this.findGalleryItems(galleryId);
  }

  // ── Videos ─────────────────────────────────────────────────────────

  async findVideoById(
    tenantId: string,
    id: string,
  ): Promise<VideoEntity | null> {
    const rows = await db
      .select()
      .from(videos)
      .where(and(eq(videos.tenantId, tenantId), eq(videos.id, id)))
      .limit(1);

    return rows.length === 0 ? null : this.toVideoEntity(rows[0]);
  }

  async findAllVideos(tenantId: string): Promise<VideoEntity[]> {
    const rows = await db
      .select()
      .from(videos)
      .where(eq(videos.tenantId, tenantId))
      .orderBy(asc(videos.order));

    return rows.map((row) => this.toVideoEntity(row));
  }

  async createVideo(data: {
    tenantId: string;
    sourceType: string;
    url: string;
    title: string;
    description?: Record<string, string> | null;
    thumbnailMediaId?: string | null;
    order?: number;
  }): Promise<VideoEntity> {
    const rows = await db
      .insert(videos)
      .values({
        tenantId: data.tenantId,
        sourceType: data.sourceType as 'youtube' | 'vimeo' | 'local',
        url: data.url,
        title: data.title,
        description: data.description ?? null,
        thumbnailMediaId: data.thumbnailMediaId ?? null,
        order: data.order ?? 0,
      })
      .returning();

    return this.toVideoEntity(rows[0]);
  }

  async deleteVideo(tenantId: string, id: string): Promise<boolean> {
    const rows = await db
      .delete(videos)
      .where(and(eq(videos.tenantId, tenantId), eq(videos.id, id)))
      .returning();

    return rows.length > 0;
  }

  async reorderVideos(tenantId: string, ids: string[]): Promise<VideoEntity[]> {
    for (let i = 0; i < ids.length; i++) {
      await db
        .update(videos)
        .set({ order: i, updatedAt: new Date() })
        .where(and(eq(videos.tenantId, tenantId), eq(videos.id, ids[i])));
    }

    return this.findAllVideos(tenantId);
  }
}
