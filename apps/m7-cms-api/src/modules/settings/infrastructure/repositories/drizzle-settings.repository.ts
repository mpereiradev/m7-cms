import { Injectable } from '@nestjs/common';
import { eq, and } from 'drizzle-orm';
import { db } from '../../../../infrastructure/database/db.js';
import { settings } from '../../../../infrastructure/database/schema/index.js';
import type { ISettingsRepository } from '../../application/ports/i-settings-repository.port.js';
import { SettingEntity } from '../../domain/entities/setting.entity.js';

@Injectable()
export class DrizzleSettingsRepository implements ISettingsRepository {
  private toEntity(row: typeof settings.$inferSelect): SettingEntity {
    return new SettingEntity({
      id: row.id,
      tenantId: row.tenantId,
      key: row.key,
      value: row.value,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  }

  async findAll(tenantId: string): Promise<SettingEntity[]> {
    const rows = await db
      .select()
      .from(settings)
      .where(eq(settings.tenantId, tenantId));
    return rows.map(this.toEntity);
  }

  async findByKey(
    tenantId: string,
    key: string,
  ): Promise<SettingEntity | null> {
    const rows = await db
      .select()
      .from(settings)
      .where(and(eq(settings.tenantId, tenantId), eq(settings.key, key)));
    return rows.length > 0 ? this.toEntity(rows[0]) : null;
  }

  async upsert(
    tenantId: string,
    key: string,
    value: unknown,
  ): Promise<SettingEntity> {
    const existing = await this.findByKey(tenantId, key);
    if (existing) {
      const [row] = await db
        .update(settings)
        .set({ value, updatedAt: new Date() })
        .where(and(eq(settings.tenantId, tenantId), eq(settings.key, key)))
        .returning();
      return this.toEntity(row);
    }
    const [row] = await db
      .insert(settings)
      .values({ tenantId, key, value })
      .returning();
    return this.toEntity(row);
  }

  async batchUpsert(
    tenantId: string,
    items: { key: string; value: unknown }[],
  ): Promise<SettingEntity[]> {
    const results: SettingEntity[] = [];
    for (const item of items) {
      results.push(await this.upsert(tenantId, item.key, item.value));
    }
    return results;
  }
}
