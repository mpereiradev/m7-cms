import { pgTable, uuid, varchar, text } from 'drizzle-orm/pg-core';
import { categories } from './categories.schema.js';

export const categoryTranslations = pgTable('category_translations', {
  id: uuid('id').primaryKey().defaultRandom(),
  categoryId: uuid('category_id')
    .notNull()
    .references(() => categories.id, { onDelete: 'cascade' }),
  languageCode: varchar('language_code', { length: 10 }).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
});
