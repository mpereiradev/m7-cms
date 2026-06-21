---
name: db-migrate
description: Create and apply a Drizzle ORM migration for the m7-cms-api database. Use when a schema change is needed (new table, new column, index, RLS policy). Shows the generated SQL before running.
disable-model-invocation: true
---

You are managing a Drizzle ORM migration for the m7-cms-api.

Migration task: $ARGUMENTS

## Pre-flight reads

1. `apps/m7-cms-api/src/infrastructure/database/schema/` — existing schema files
2. `spec/discovery-back-end.md` — table definitions section, to verify fields are correct

## Steps

### 1. Update or create the schema file

Schema files live in `apps/m7-cms-api/src/infrastructure/database/schema/<entity>.schema.ts`.

Rules:
- Every table must have: `id uuid PK`, `tenantId uuid NOT NULL`, `createdAt`, `updatedAt`
- Translation tables: `id`, `<parent>Id FK`, `languageCode varchar(10)`, then translated fields
- Use `pgTable` from `drizzle-orm/pg-core`
- Export a type: `export type <Entity> = typeof <table>.$inferSelect`
- Export an insert type: `export type New<Entity> = typeof <table>.$inferInsert`

If the schema file already exists, add the new column/index — do not recreate the whole file.

Export all tables from `apps/m7-cms-api/src/infrastructure/database/schema/index.ts`.

### 2. Generate the migration

```bash
pnpm --filter m7-cms-api drizzle-kit generate
```

This creates a new file in `apps/m7-cms-api/drizzle/migrations/`.

### 3. Show the SQL

Read the generated `.sql` file and display it to the user before applying:

```
Generated SQL:
---
<sql content>
---
Apply this migration? (the user must confirm before step 4)
```

Wait for user confirmation.

### 4. Apply the migration

```bash
pnpm --filter m7-cms-api drizzle-kit migrate
```

### 5. Add RLS policy (if new table)

For every new table, generate the SQL for the RLS policy and show it to the user:

```sql
ALTER TABLE <table> ENABLE ROW LEVEL SECURITY;

CREATE POLICY "<table>_tenant_isolation" ON <table>
  USING (tenant_id = current_setting('app.tenant_id')::uuid);
```

Instruct the user to run this SQL in the Supabase SQL editor (it cannot be applied via Drizzle automatically).

## Rollback

If something goes wrong, run:
```bash
pnpm --filter m7-cms-api drizzle-kit drop
```
Then restore the previous schema file from git: `git checkout -- apps/m7-cms-api/src/infrastructure/database/schema/<file>`.

## Output

Summarize:
1. Schema files modified
2. Migration file created (path)
3. SQL applied
4. RLS policy SQL for user to run manually in Supabase
