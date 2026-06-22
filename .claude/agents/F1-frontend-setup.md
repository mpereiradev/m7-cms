# Agent F1 — frontend-setup
## Install all deps + configure Next.js app baseline

**Scope:** No UI pages. Only: install packages, configure Tailwind v4, shadcn/ui, next-intl, QueryClientProvider, Supabase SSR client, global layout shell.

**Pre-requisite:** B2 complete (know the API base URL and auth patterns).

---

## Read (in order, stop when sufficient)

1. `apps/m7-cms-web/CLAUDE.md` — tech stack list
2. `apps/m7-cms-web/package.json` — current deps
3. `apps/m7-cms-web/app/globals.css` — Tailwind base
4. `apps/m7-cms-web/app/layout.tsx` — root layout

Do NOT read spec/ or backend files.

---

## Step 1: Install packages

```bash
pnpm --filter m7-cms-web add \
  @supabase/supabase-js @supabase/ssr \
  react-hook-form zod @hookform/resolvers \
  @tanstack/react-query @tanstack/react-table \
  @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities \
  next-intl \
  @editorjs/editorjs @editorjs/header @editorjs/paragraph @editorjs/image @editorjs/list \
  recharts \
  sonner

pnpm --filter m7-cms-web add -D \
  @types/node
```

## Step 2: shadcn/ui init

```bash
cd apps/m7-cms-web && npx shadcn@latest init -d
```

Install base components:
```bash
npx shadcn@latest add button input form label select checkbox textarea badge card table tabs dialog sheet skeleton toast dropdown-menu sidebar avatar separator
```

## Step 3: Configure next-intl

Create `apps/m7-cms-web/i18n/routing.ts`:
```typescript
import { defineRouting } from 'next-intl/routing';
export const routing = defineRouting({
  locales: ['pt-BR', 'en'],
  defaultLocale: 'pt-BR',
});
```

Create locale message files:
- `apps/m7-cms-web/messages/pt-BR.json` — `{ "nav": { "pages": "Páginas", "posts": "Posts", ... } }`
- `apps/m7-cms-web/messages/en.json`

Configure `next.config.ts` to add next-intl plugin.

## Step 4: Supabase SSR client

Create `apps/m7-cms-web/lib/supabase/`:
- `client.ts` — browser client (`createBrowserClient`)
- `server.ts` — server client (`createServerClient` with cookies)
- `middleware.ts` — exported `createSupabaseMiddleware` helper

## Step 5: React Query provider

Create `apps/m7-cms-web/components/providers/query-provider.tsx` — `'use client'`, wraps `QueryClientProvider`.

## Step 6: API client base

Create `apps/m7-cms-web/lib/api/client.ts`:
```typescript
// Base fetch wrapper that attaches JWT from Supabase session + X-Tenant-ID header
export async function apiRequest<T>(path: string, init?: RequestInit): Promise<T>
```

## Step 7: Root layout update

Update `apps/m7-cms-web/app/layout.tsx` to wrap with `NextIntlClientProvider` + `QueryProvider`.

---

## Done when
- [ ] All packages installed and resolvable
- [ ] shadcn/ui components exist in `components/ui/`
- [ ] `lib/supabase/client.ts` and `server.ts` created
- [ ] `lib/api/client.ts` created
- [ ] `next-intl` configured with pt-BR + en
- [ ] `pnpm --filter m7-cms-web build` passes with no errors
- [ ] `pnpm --filter m7-cms-web lint` passes

## Output to orchestrator

```
## F1 Done

### Packages installed
<list>

### shadcn components installed
<list>

### Created files
- lib/supabase/client.ts, server.ts, middleware.ts
- lib/api/client.ts
- components/providers/query-provider.tsx
- messages/pt-BR.json, messages/en.json
- i18n/routing.ts

### Blockers
<any>
```
