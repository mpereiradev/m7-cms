import { Injectable } from '@nestjs/common';
import { eq, and } from 'drizzle-orm';
import { db } from '../../../../infrastructure/database/db.js';
import {
  stores,
  storeTranslations,
  storeHours,
} from '../../../../infrastructure/database/schema/index.js';
import type {
  IStoreRepository,
  CreateStoreData,
  UpdateStoreData,
  SetStoreHoursData,
} from '../../application/ports/i-store-repository.port.js';
import {
  StoreEntity,
  StoreTranslationValue,
  StoreHourValue,
} from '../../domain/entities/store.entity.js';

@Injectable()
export class DrizzleStoreRepository implements IStoreRepository {
  private toEntity(
    row: typeof stores.$inferSelect,
    translations: (typeof storeTranslations.$inferSelect)[],
    hours: (typeof storeHours.$inferSelect)[],
  ): StoreEntity {
    return new StoreEntity({
      id: row.id,
      tenantId: row.tenantId,
      slug: row.slug,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      translations: translations.map(
        (t) =>
          new StoreTranslationValue({
            id: t.id,
            storeId: t.storeId,
            languageCode: t.languageCode,
            name: t.name,
            address: t.address,
            description: t.description,
            email: t.email,
            phone: t.phone,
            whatsapp: t.whatsapp,
          }),
      ),
      hours: hours.map(
        (h) =>
          new StoreHourValue({
            id: h.id,
            storeId: h.storeId,
            weekday: h.weekday,
            openTime: h.openTime,
            closeTime: h.closeTime,
          }),
      ),
    });
  }

  private async loadRelations(storeId: string) {
    const [translations, hours] = await Promise.all([
      db
        .select()
        .from(storeTranslations)
        .where(eq(storeTranslations.storeId, storeId)),
      db.select().from(storeHours).where(eq(storeHours.storeId, storeId)),
    ]);
    return { translations, hours };
  }

  async findById(tenantId: string, id: string): Promise<StoreEntity | null> {
    const rows = await db
      .select()
      .from(stores)
      .where(and(eq(stores.tenantId, tenantId), eq(stores.id, id)))
      .limit(1);

    if (rows.length === 0) return null;

    const { translations, hours } = await this.loadRelations(rows[0].id);
    return this.toEntity(rows[0], translations, hours);
  }

  async findAllByTenant(tenantId: string): Promise<StoreEntity[]> {
    const rows = await db
      .select()
      .from(stores)
      .where(eq(stores.tenantId, tenantId));

    const results: StoreEntity[] = [];
    for (const row of rows) {
      const { translations, hours } = await this.loadRelations(row.id);
      results.push(this.toEntity(row, translations, hours));
    }
    return results;
  }

  async create(data: CreateStoreData): Promise<StoreEntity> {
    const [storeRow] = await db
      .insert(stores)
      .values({
        tenantId: data.tenantId,
        slug: data.slug,
        mapUrl: data.mapUrl ?? null,
      })
      .returning();

    if (data.translations.length > 0) {
      await db.insert(storeTranslations).values(
        data.translations.map((t) => ({
          storeId: storeRow.id,
          languageCode: t.languageCode,
          name: t.name,
          address: t.address ?? null,
          description: t.description ?? null,
          email: t.email ?? null,
          phone: t.phone ?? null,
          whatsapp: t.whatsapp ?? null,
        })),
      );
    }

    const { translations, hours } = await this.loadRelations(storeRow.id);
    return this.toEntity(storeRow, translations, hours);
  }

  async update(
    tenantId: string,
    id: string,
    data: UpdateStoreData,
  ): Promise<StoreEntity | null> {
    // Verify store belongs to tenant
    const existing = await db
      .select()
      .from(stores)
      .where(and(eq(stores.tenantId, tenantId), eq(stores.id, id)))
      .limit(1);

    if (existing.length === 0) return null;

    const updateData: Record<string, unknown> = { updatedAt: new Date() };
    if (data.slug !== undefined) updateData.slug = data.slug;

    const [updatedRow] = await db
      .update(stores)
      .set(updateData)
      .where(eq(stores.id, id))
      .returning();

    // Replace translations if provided
    if (data.translations !== undefined) {
      await db
        .delete(storeTranslations)
        .where(eq(storeTranslations.storeId, id));

      if (data.translations.length > 0) {
        await db.insert(storeTranslations).values(
          data.translations.map((t) => ({
            storeId: id,
            languageCode: t.languageCode,
            name: t.name,
            address: t.address ?? null,
            description: t.description ?? null,
            email: t.email ?? null,
            phone: t.phone ?? null,
            whatsapp: t.whatsapp ?? null,
          })),
        );
      }
    }

    const { translations, hours } = await this.loadRelations(id);
    return this.toEntity(updatedRow, translations, hours);
  }

  async delete(tenantId: string, id: string): Promise<boolean> {
    const deleted = await db
      .delete(stores)
      .where(and(eq(stores.tenantId, tenantId), eq(stores.id, id)))
      .returning();

    return deleted.length > 0;
  }

  async setHours(
    tenantId: string,
    storeId: string,
    data: SetStoreHoursData,
  ): Promise<StoreEntity | null> {
    // Verify store belongs to tenant
    const existing = await db
      .select()
      .from(stores)
      .where(and(eq(stores.tenantId, tenantId), eq(stores.id, storeId)))
      .limit(1);

    if (existing.length === 0) return null;

    // Replace all hours
    await db.delete(storeHours).where(eq(storeHours.storeId, storeId));

    if (data.hours.length > 0) {
      await db.insert(storeHours).values(
        data.hours.map((h) => ({
          storeId,
          weekday: h.weekday,
          openTime: h.openTime,
          closeTime: h.closeTime,
        })),
      );
    }

    // Update store timestamp
    const [updatedRow] = await db
      .update(stores)
      .set({ updatedAt: new Date() })
      .where(eq(stores.id, storeId))
      .returning();

    const { translations, hours } = await this.loadRelations(storeId);
    return this.toEntity(updatedRow, translations, hours);
  }
}
