import { pgTable, uuid, varchar, text, jsonb } from 'drizzle-orm/pg-core';
import { posts } from './posts.schema.js';

export const postTranslations = pgTable('post_translations', {
  id: uuid('id').primaryKey().defaultRandom(),
  postId: uuid('post_id')
    .notNull()
    .references(() => posts.id, { onDelete: 'cascade' }),
  languageCode: varchar('language_code', { length: 10 }).notNull(),
  title: varchar('title', { length: 500 }).notNull(),
  summary: text('summary'),
  content: jsonb('content'),
});
