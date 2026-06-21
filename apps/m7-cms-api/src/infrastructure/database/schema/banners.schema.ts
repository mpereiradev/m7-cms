import {
  pgTable,
  uuid,
  varchar,
  text,
  integer,
  timestamp,
} from 'drizzle-orm/pg-core';
import { tenants } from './tenants.schema.js';
import { media } from './media.schema.js';

export const banners = pgTable('banners', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id')
    .notNull()
    .references(() => tenants.id, { onDelete: 'cascade' }),
  title: varchar('title', { length: 500 }),
  mediaId: uuid('media_id').references(() => media.id, {
    onDelete: 'set null',
  }),
  ctaLabel: varchar('cta_label', { length: 255 }),
  linkUrl: text('link_url'),
  displayStart: timestamp('display_start'),
  displayEnd: timestamp('display_end'),
  order: integer('order').notNull().default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
