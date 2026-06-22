import { Injectable } from '@nestjs/common';
import { eq, and } from 'drizzle-orm';
import { db } from '../../../../infrastructure/database/db.js';
import { media } from '../../../../infrastructure/database/schema/index.js';
import type { IMediaRepository } from '../../application/ports/i-media-repository.port.js';
import { MediaEntity } from '../../domain/entities/media.entity.js';

@Injectable()
export class DrizzleMediaRepository implements IMediaRepository {
  private toEntity(row: typeof media.$inferSelect): MediaEntity {
    return new MediaEntity({
      id: row.id,
      tenantId: row.tenantId,
      filename: row.filename,
      url: row.url,
      mimeType: row.mimeType,
      size: row.size,
      width: row.width,
      height: row.height,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  }

  async findById(id: string, tenantId: string): Promise<MediaEntity | null> {
    const rows = await db
      .select()
      .from(media)
      .where(and(eq(media.id, id), eq(media.tenantId, tenantId)))
      .limit(1);

    if (rows.length === 0) {
      return null;
    }

    return this.toEntity(rows[0]);
  }

  async findAllByTenant(tenantId: string): Promise<MediaEntity[]> {
    const rows = await db
      .select()
      .from(media)
      .where(eq(media.tenantId, tenantId));

    return rows.map((row) => this.toEntity(row));
  }

  async create(data: {
    tenantId: string;
    filename: string;
    url: string;
    mimeType: string;
    size: number | null;
    width: number | null;
    height: number | null;
  }): Promise<MediaEntity> {
    const rows = await db
      .insert(media)
      .values({
        tenantId: data.tenantId,
        filename: data.filename,
        url: data.url,
        mimeType: data.mimeType,
        size: data.size,
        width: data.width,
        height: data.height,
      })
      .returning();

    return this.toEntity(rows[0]);
  }

  async delete(id: string, tenantId: string): Promise<boolean> {
    const rows = await db
      .delete(media)
      .where(and(eq(media.id, id), eq(media.tenantId, tenantId)))
      .returning();

    return rows.length > 0;
  }
}
