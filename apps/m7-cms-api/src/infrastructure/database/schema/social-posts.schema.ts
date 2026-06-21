import {
  pgTable,
  uuid,
  varchar,
  text,
  integer,
  timestamp,
  pgEnum,
} from 'drizzle-orm/pg-core';
import { tenants } from './tenants.schema.js';

export const socialPlatformEnum = pgEnum('social_platform', [
  'facebook',
  'instagram',
  'linkedin',
  'pinterest',
  'tiktok',
  'x',
  'youtube',
]);

export const socialPosts = pgTable('social_posts', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id')
    .notNull()
    .references(() => tenants.id, { onDelete: 'cascade' }),
  platform: socialPlatformEnum('platform').notNull(),
  url: text('url').notNull(),
  title: varchar('title', { length: 500 }),
  publishedAt: timestamp('published_at'),
  order: integer('order').notNull().default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
