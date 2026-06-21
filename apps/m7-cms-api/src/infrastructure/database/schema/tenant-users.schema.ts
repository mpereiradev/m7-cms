import { pgTable, uuid, timestamp, pgEnum } from 'drizzle-orm/pg-core';
import { tenants } from './tenants.schema.js';
import { users } from './users.schema.js';

export const userRoleEnum = pgEnum('user_role', [
  'super_admin',
  'admin',
  'editor',
  'author',
  'viewer',
]);

export const tenantUsers = pgTable('tenant_users', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id')
    .notNull()
    .references(() => tenants.id, { onDelete: 'cascade' }),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  role: userRoleEnum('role').notNull().default('viewer'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
