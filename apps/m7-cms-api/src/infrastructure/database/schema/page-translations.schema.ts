import { pgTable, uuid, varchar, text } from 'drizzle-orm/pg-core';
import { pages } from './pages.schema.js';

export const pageTranslations = pgTable('page_translations', {
  id: uuid('id').primaryKey().defaultRandom(),
  pageId: uuid('page_id')
    .notNull()
    .references(() => pages.id, { onDelete: 'cascade' }),
  languageCode: varchar('language_code', { length: 10 }).notNull(),
  title: varchar('title', { length: 500 }).notNull(),
  seoTitle: varchar('seo_title', { length: 500 }),
  seoDescription: text('seo_description'),
});
