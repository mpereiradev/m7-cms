import { Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { db } from '../../../../infrastructure/database/db.js';
import { tenants } from '../../../../infrastructure/database/schema/index.js';
import type { ITenantRepository } from '../../application/ports/i-tenant-repository.port.js';
import { TenantEntity } from '../../domain/entities/tenant.entity.js';

@Injectable()
export class DrizzleTenantRepository implements ITenantRepository {
  private toEntity(row: typeof tenants.$inferSelect): TenantEntity {
    return new TenantEntity({
      id: row.id,
      slug: row.slug,
      name: row.name,
      domain: row.domain,
      logoUrl: row.logoUrl,
      languages: row.languages,
      theme: row.theme,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  }

  async findById(id: string): Promise<TenantEntity | null> {
    const rows = await db
      .select()
      .from(tenants)
      .where(eq(tenants.id, id))
      .limit(1);

    if (rows.length === 0) {
      return null;
    }

    return this.toEntity(rows[0]);
  }

  async findAll(): Promise<TenantEntity[]> {
    const rows = await db.select().from(tenants);
    return rows.map((row) => this.toEntity(row));
  }

  async create(data: {
    slug: string;
    name: string;
    domain?: string | null;
    logoUrl?: string | null;
    languages?: string[];
    theme?: string | null;
  }): Promise<TenantEntity> {
    const rows = await db
      .insert(tenants)
      .values({
        slug: data.slug,
        name: data.name,
        domain: data.domain ?? null,
        logoUrl: data.logoUrl ?? null,
        languages: data.languages ?? ['pt-BR'],
        theme: data.theme ?? null,
      })
      .returning();

    return this.toEntity(rows[0]);
  }

  async update(
    id: string,
    data: {
      slug?: string;
      name?: string;
      domain?: string | null;
      logoUrl?: string | null;
      languages?: string[];
      theme?: string | null;
    },
  ): Promise<TenantEntity | null> {
    const updateData: Record<string, unknown> = {
      updatedAt: new Date(),
    };

    if (data.slug !== undefined) updateData.slug = data.slug;
    if (data.name !== undefined) updateData.name = data.name;
    if (data.domain !== undefined) updateData.domain = data.domain;
    if (data.logoUrl !== undefined) updateData.logoUrl = data.logoUrl;
    if (data.languages !== undefined) updateData.languages = data.languages;
    if (data.theme !== undefined) updateData.theme = data.theme;

    const rows = await db
      .update(tenants)
      .set(updateData)
      .where(eq(tenants.id, id))
      .returning();

    if (rows.length === 0) {
      return null;
    }

    return this.toEntity(rows[0]);
  }
}
