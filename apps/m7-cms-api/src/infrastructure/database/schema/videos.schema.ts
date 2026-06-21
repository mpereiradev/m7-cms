import {
  pgTable,
  uuid,
  varchar,
  text,
  integer,
  jsonb,
  timestamp,
  pgEnum,
} from 'drizzle-orm/pg-core';
import { tenants } from './tenants.schema.js';
import { media } from './media.schema.js';

export const videoSourceTypeEnum = pgEnum('video_source_type', [
  'youtube',
  'vimeo',
  'local',
]);

export const videos = pgTable('videos', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id')
    .notNull()
    .references(() => tenants.id, { onDelete: 'cascade' }),
  sourceType: videoSourceTypeEnum('source_type').notNull(),
  url: text('url').notNull(),
  title: varchar('title', { length: 500 }).notNull(),
  description: jsonb('description'),
  thumbnailMediaId: uuid('thumbnail_media_id').references(() => media.id, {
    onDelete: 'set null',
  }),
  order: integer('order').notNull().default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
