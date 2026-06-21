# CLAUDE.md — m7-cms-web

Next.js 16 admin panel for the m7-cms platform. Read the root `CLAUDE.md` first for monorepo conventions.

## Commands

```bash
pnpm dev     # dev server (port 3000)
pnpm build   # production build
pnpm start   # start production server
pnpm lint    # eslint
```

## App Router Structure

```
app/
  (auth)/
    login/page.tsx
    forgot-password/page.tsx
  (dashboard)/
    layout.tsx             # Sidebar + TopBar, AuthProvider, QueryClientProvider
    dashboard/page.tsx
    pages/
      page.tsx             # listing
      new/page.tsx
      [id]/page.tsx        # edit
    posts/…
    categories/…
    tags/…
    galleries/
      images/…
      videos/…
    social/…
    banners/…
    stores/…
    contact-submissions/…
    users/…
    settings/…
middleware.ts              # Auth redirect guard
```

Path alias `@/*` maps to the app root (see tsconfig.json `paths`).

## UI Stack

- **shadcn/ui** + **Tailwind CSS v4** — use shadcn components for all UI. Install new components with `npx shadcn@latest add <component>`. Do not manually create primitives that shadcn already provides.
- Tailwind v4 uses CSS `@import "tailwindcss"` and `@theme` in globals.css — no `tailwind.config.js`.
- Design tokens and brand colors go in `app/globals.css` under `@theme { --color-… }`.

## Forms

Always use **React Hook Form** + **Zod**:

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({ title: z.string().min(1) });

const form = useForm({ resolver: zodResolver(schema) });
```

Never use uncontrolled inputs without RHF. Never use `useState` for form state.

## Data Fetching

Use **@tanstack/react-query** for all server data. Pattern:

```typescript
// lib/hooks/use-pages.ts
export function usePages(tenantId: string) {
  return useQuery({ queryKey: ['pages', tenantId], queryFn: () => api.pages.list(tenantId) });
}
```

API calls go through `lib/api-client.ts` which attaches the JWT from the Supabase session cookie.

## Authentication

- **Supabase Auth** via `@supabase/ssr` (server-side) and `@supabase/supabase-js` (client)
- `middleware.ts` checks `supabase.auth.getUser()` and redirects unauthenticated users to `/login`
- JWT stored in cookies (HttpOnly) — never localStorage
- After login, read `tenantId` from JWT claims or a `/api/v1/users/me` call

## RBAC

Roles: `super_admin`, `admin`, `editor`, `author`, `viewer`.

```typescript
// components/role-guard.tsx
// Wrap sections/buttons that need permission
<RoleGuard roles={['admin', 'editor']}>
  <DeleteButton />
</RoleGuard>
```

Never show admin-only UI to editors — check role before rendering, not just on action.

## Block Editor (Editor.js)

- Wrap Editor.js in a Client Component (`'use client'`)
- Save output as JSONB; send to API as-is
- Do not transform Editor.js JSON on the frontend — the API stores it verbatim

## Drag-and-Drop

Use `@dnd-kit/core` + `@dnd-kit/sortable` for reordering sections, gallery items, banners. Persist order on `onDragEnd` by calling the update endpoint.

## Internationalization

- **next-intl** for UI strings — messages in `locales/pt-BR.json`, `locales/en.json`
- Content translation: per-entity tabs (`pt-BR | en`) in edit forms
- All translatable fields are stored in `*_translations` tables via the API

## TypeScript

- Strict mode (`"strict": true` in tsconfig)
- Use `type` instead of `interface` for object shapes (project convention)
- `@/*` import alias must be used for all non-relative imports within the app

## Design System

UI/UX references are in `.docs/ui-ux/` at the monorepo root. As features are built, document reusable patterns and tokens in `.docs/design-system.md`. The design system grows alongside the codebase — do not write it all upfront.
