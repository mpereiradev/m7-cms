import { Injectable } from '@nestjs/common';
import { eq, and } from 'drizzle-orm';
import { db } from '../../../../infrastructure/database/db.js';
import { tags } from '../../../../infrastructure/database/schema/index.js';
import type { ITagRepository } from '../../application/ports/i-post-repository.port.js';
import { TagEntity } from '../../domain/entities/post.entity.js';

@Injectable()
export class DrizzleTagRepository implements ITagRepository {
  async findById(tenantId: string, id: string): Promise<TagEntity | null> {
    const rows = await db
      .select()
      .from(tags)
      .where(and(eq(tags.tenantId, tenantId), eq(tags.id, id)));
    if (rows.length === 0) return null;
    return new TagEntity(rows[0]);
  }

  async findAll(tenantId: string): Promise<TagEntity[]> {
    const rows = await db
      .select()
      .from(tags)
      .where(eq(tags.tenantId, tenantId));
    return rows.map((row) => new TagEntity(row));
  }

  async create(data: { tenantId: string; slug: string }): Promise<TagEntity> {
    const [row] = await db
      .insert(tags)
      .values({ tenantId: data.tenantId, slug: data.slug })
      .returning();
    return new TagEntity(row);
  }
}
