---
name: implement-page
description: Scaffold a complete Next.js admin page for the m7-cms-web. Use when asked to build a new admin section (Pages listing, Post editor, Gallery manager, etc.). Generates the route file, React Query hooks, API client function, Zod schema, React Hook Form, and shadcn/ui components.
---

You are implementing an admin page for the m7-cms-web panel.

Page/section to implement: $ARGUMENTS

## Pre-flight: read these files first (stop when you have enough context)

1. `spec/discovery-front-end.md` — find the UX spec for this section
2. `apps/m7-cms-web/CLAUDE.md` — conventions and component patterns
3. `.docs/ui-ux/` — check for any design reference images for this section
4. `apps/m7-cms-web/app/(dashboard)/layout.tsx` — existing layout and providers
5. One existing page for reference (pick the closest analog)

Do NOT read node_modules. Do NOT read files not in scope.

## File structure to create

```
apps/m7-cms-web/app/(dashboard)/<route>/
  page.tsx              # Server Component: metadata, initial data fetch (if any), passes to client
  <route>-client.tsx    # Client Component: table/form UI, React Query hooks

apps/m7-cms-web/lib/
  api/
    <resource>.api.ts   # API client functions (getX, createX, updateX, deleteX)
  hooks/
    use-<resource>.ts   # React Query hooks wrapping the API functions
  schemas/
    <resource>.schema.ts # Zod schema for form validation
```

For list pages, also create:
```
apps/m7-cms-web/components/<resource>/
  <resource>-table.tsx  # @tanstack/react-table based data table
  <resource>-columns.tsx
```

For edit/create pages:
```
apps/m7-cms-web/components/<resource>/
  <resource>-form.tsx   # React Hook Form + Zod + shadcn/ui Form components
```

## Rules

- **Server Components** (`page.tsx`): no `useState`, no event handlers, no `'use client'`. Can be async.
- **Client Components**: add `'use client'` at top, use hooks and event handlers.
- **shadcn/ui**: use `Form`, `FormField`, `FormItem`, `FormLabel`, `FormMessage` from `@/components/ui/form` for all form fields. Never build raw input elements.
- **React Hook Form**: `useForm({ resolver: zodResolver(schema) })` — always pair with Zod.
- **React Query**:
  - List: `useQuery({ queryKey: ['<resource>'], queryFn: api.<resource>.list })`
  - Mutation: `useMutation({ mutationFn: api.<resource>.create, onSuccess: () => queryClient.invalidateQueries(['<resource>']) })`
- **Auth**: use `useAuth()` from the AuthProvider to get `tenantId` and `role`. Pass `tenantId` in all API calls.
- **RBAC**: wrap destructive actions in `<RoleGuard roles={['admin']}>`. Editors cannot delete.
- **Pagination**: list pages accept `?page=&perPage=` search params, pass to API.
- **Loading states**: use shadcn `Skeleton` while query is loading. Use `toast` for success/error mutations.
- **Imports**: always use `@/` prefix (e.g. `@/components/ui/button`, `@/lib/hooks/use-pages`).

## Multilingual content fields

If the entity has translations (`*_translations` table):
- Render one tab per language using shadcn `Tabs`
- Validate that required fields are filled for each language before submitting
- Send `translations: [{ languageCode: 'pt-BR', title: '...' }]` to the API

## Checklist before finishing

- [ ] Route accessible from sidebar navigation (update sidebar component)
- [ ] Page is protected by `middleware.ts` (no public access)
- [ ] Form validation shows field-level errors via `FormMessage`
- [ ] Mutation shows toast on success and error
- [ ] Run `pnpm --filter m7-cms-web lint` — fix all errors
- [ ] Run `pnpm --filter m7-cms-web build` — no type errors

## Output

Summarize:
1. Files created (paths)
2. Route URL (e.g. `/pages`, `/pages/new`, `/pages/[id]`)
3. API endpoints consumed
4. Any missing API endpoints that the backend needs to expose
