import { pgTable, uuid, integer, jsonb, timestamp } from 'drizzle-orm/pg-core';
import { galleries } from './galleries.schema.js';
import { media } from './media.schema.js';

export const galleryItems = pgTable('gallery_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  galleryId: uuid('gallery_id')
    .notNull()
    .references(() => galleries.id, { onDelete: 'cascade' }),
  mediaId: uuid('media_id')
    .notNull()
    .references(() => media.id, { onDelete: 'cascade' }),
  order: integer('order').notNull().default(0),
  caption: jsonb('caption'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
