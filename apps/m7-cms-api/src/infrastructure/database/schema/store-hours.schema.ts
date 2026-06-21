import { pgTable, uuid, integer, time } from 'drizzle-orm/pg-core';
import { stores } from './stores.schema.js';

export const storeHours = pgTable('store_hours', {
  id: uuid('id').primaryKey().defaultRandom(),
  storeId: uuid('store_id')
    .notNull()
    .references(() => stores.id, { onDelete: 'cascade' }),
  weekday: integer('weekday').notNull(), // 0 = Sunday, 6 = Saturday
  openTime: time('open_time').notNull(),
  closeTime: time('close_time').notNull(),
});
