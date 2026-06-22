# Agent B1 — infra-schema
## Drizzle schema completo + migrações + SQL RLS

**Scope:** Create ALL Drizzle table schemas for m7-cms-api, generate one consolidated migration, and output the RLS policy SQL for each table. This is the ONLY task — do not implement any NestJS modules.

---

## Read (in order, stop when sufficient)

1. `spec/discovery-back-end.md` — section "Modelagem de Dados" (tables + fields)
2. `apps/m7-cms-api/CLAUDE.md` — Drizzle conventions
3. `apps/m7-cms-api/tsconfig.json` — module system

Do NOT read node_modules or any src/ files (they are empty starters).

---

## Install Drizzle first

```bash
pnpm --filter m7-cms-api add drizzle-orm pg
pnpm --filter m7-cms-api add -D drizzle-kit @types/pg
```

Add to `apps/m7-cms-api/package.json` scripts:
```json
"db:generate": "drizzle-kit generate",
"db:migrate": "drizzle-kit migrate",
"db:studio": "drizzle-kit studio"
```

Create `apps/m7-cms-api/drizzle.config.ts`:
```typescript
import type { Config } from 'drizzle-kit';
export default {
  schema: './src/infrastructure/database/schema/index.ts',
  out: './drizzle/migrations',
  dialect: 'postgresql',
  dbCredentials: { url: process.env.DATABASE_URL! },
} satisfies Config;
```

---

## Files to create

```
apps/m7-cms-api/src/infrastructure/database/
  schema/
    tenants.schema.ts
    users.schema.ts
    tenant-users.schema.ts
    pages.schema.ts
    page-translations.schema.ts
    sections.schema.ts
    posts.schema.ts
    post-translations.schema.ts
    categories.schema.ts
    category-translations.schema.ts
    tags.schema.ts
    post-tags.schema.ts          ← N:N join table
    media.schema.ts
    galleries.schema.ts
    gallery-items.schema.ts
    videos.schema.ts
    social-posts.schema.ts
    banners.schema.ts
    stores.schema.ts
    store-translations.schema.ts
    store-hours.schema.ts
    contact-form-submissions.schema.ts
    settings.schema.ts
    index.ts                      ← re-exports all tables + types
  db.ts                           ← drizzle(pool) singleton
```

---

## Schema rules

Every table MUST include: `id uuid PK defaultRandom()`, `tenantId uuid notNull()`, `createdAt timestamp defaultNow()`, `updatedAt timestamp defaultNow()`.

Exception — translation tables: use `id`, `<parent>Id FK`, `languageCode varchar(10)` instead of tenantId (inherit via parent join).

Exception — join tables (post_tags): `postId FK`, `tagId FK`, composite PK.

Exception — `users` table: no tenantId (users are global, linked via tenant_users).

Exception — `tenant_users` table: tenantId + userId FK + role enum.

Exception — `store_hours`: storeId FK + weekday + open/close times (no tenantId direct).

Use `pgEnum` for status fields: `status: pgEnum('page_status', ['draft', 'published'])`.

Use `jsonb` for `content` fields in sections, post/video descriptions.

Use `text[]` (array) for `languages` in tenants table.

---

## db.ts singleton

```typescript
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle(pool, { schema });
export type DB = typeof db;
```

---

## After schema files: generate migration

```bash
pnpm --filter m7-cms-api db:generate
```

Read the generated SQL file and verify it matches the spec tables.

---

## Output to orchestrator

```
## B1 Done

### Tables created (N total)
- tenants, users, tenant_users, pages, page_translations, sections, ...

### Migration file
drizzle/migrations/<timestamp>_init.sql

### RLS SQL (copy-paste into Supabase SQL Editor)
\`\`\`sql
-- Enable RLS
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;
-- ... (one per table with tenantId)

-- Tenant isolation policies
CREATE POLICY "pages_tenant_isolation" ON pages
  USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
-- ... (one per table)
\`\`\`

### Blockers / issues
<any>
```

## Done when
- [ ] All schema files created with correct Drizzle types
- [ ] `index.ts` exports all tables and inferred types
- [ ] `db.ts` created
- [ ] `drizzle.config.ts` created
- [ ] Migration generated (file exists in drizzle/migrations/)
- [ ] `pnpm --filter m7-cms-api build` passes (no TS errors)
