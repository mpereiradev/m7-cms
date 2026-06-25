import { pgTable, uuid, varchar, timestamp, pgEnum } from 'drizzle-orm/pg-core';
import { tenants } from './tenants.schema.js';
import { users } from './users.schema.js';
import { media } from './media.schema.js';

export const postStatusEnum = pgEnum('post_status', ['draft', 'published']);

export const posts = pgTable('posts', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id')
    .notNull()
    .references(() => tenants.id, { onDelete: 'cascade' }),
  slug: varchar('slug', { length: 255 }).notNull(),
  status: postStatusEnum('status').notNull().default('draft'),
  publishedAt: timestamp('published_at'),
  authorId: uuid('author_id').references(() => users.id, {
    onDelete: 'set null',
  }),
  coverMediaId: uuid('cover_media_id').references(() => media.id, {
    onDelete: 'set null',
  }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
