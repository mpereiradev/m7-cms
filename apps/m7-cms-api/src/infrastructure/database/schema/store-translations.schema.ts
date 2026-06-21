import { pgTable, uuid, varchar, text } from 'drizzle-orm/pg-core';
import { stores } from './stores.schema.js';

export const storeTranslations = pgTable('store_translations', {
  id: uuid('id').primaryKey().defaultRandom(),
  storeId: uuid('store_id')
    .notNull()
    .references(() => stores.id, { onDelete: 'cascade' }),
  languageCode: varchar('language_code', { length: 10 }).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  address: text('address'),
  description: text('description'),
  email: varchar('email', { length: 255 }),
  phone: varchar('phone', { length: 50 }),
  whatsapp: varchar('whatsapp', { length: 50 }),
});
