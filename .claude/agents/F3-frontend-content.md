# Agent F3 — frontend-content
## Admin pages: Pages, Posts, Categories, Tags

**Scope:** 4 admin sections. Runs parallel with F4, F5, F6.

**Pre-requisite:** F2 complete (useAuth, RoleGuard, QueryProvider, API client available) + B4a complete (API endpoints exist).

---

## Read (in order, stop when sufficient)

1. `apps/m7-cms-web/CLAUDE.md` — component patterns, multilingual tabs
2. `apps/m7-cms-web/lib/api/client.ts`
3. `apps/m7-cms-web/components/providers/auth-provider.tsx` — useAuth
4. `.docs/ui-ux/` — any content/pages/posts design references
5. `spec/discovery-front-end.md` — sections "Páginas", "Posts", "Categorias e Tags"

---

## File structure

```
apps/m7-cms-web/
  app/(dashboard)/
    pages/
      page.tsx                    ← Server Component, list
      new/page.tsx
      [id]/page.tsx
    posts/
      page.tsx
      new/page.tsx
      [id]/page.tsx
    categories/page.tsx
    tags/page.tsx

  components/
    pages/
      page-list-client.tsx        ← 'use client', DataTable
      page-form.tsx               ← 'use client', RHF + Editor.js + lang tabs
      section-editor.tsx          ← 'use client', Editor.js wrapper
    posts/
      post-list-client.tsx
      post-form.tsx               ← RHF + Editor.js + lang tabs + cover upload
    categories/
      category-tree.tsx           ← hierarchical display
      category-form.tsx
    tags/
      tag-list-client.tsx
      tag-form.tsx

  lib/
    api/
      pages.api.ts                ← listPages, getPage, createPage, updatePage, deletePage
      posts.api.ts
      categories.api.ts
      tags.api.ts
    hooks/
      use-pages.ts                ← React Query hooks
      use-posts.ts
      use-categories.ts
      use-tags.ts
    schemas/
      page.schema.ts              ← Zod schema
      post.schema.ts
      category.schema.ts

  components/shared/
    block-editor.tsx              ← 'use client', Editor.js wrapper, accepts value/onChange
    lang-tabs.tsx                 ← tabs for pt-BR / en, wraps form fields
    data-table.tsx                ← @tanstack/react-table base component
```

---

## Key patterns

**Editor.js wrapper (block-editor.tsx):**
```typescript
// 'use client'
// Lazy-load EditorJS (no SSR)
// Props: { value: OutputData | null; onChange: (data: OutputData) => void; readOnly?: boolean }
// Use useEffect to init/destroy editor instance
```

**Multilingual form fields (lang-tabs.tsx):**
```typescript
// Renders <Tabs> with one tab per language (pt-BR, en)
// Each tab shows the translated fields for that language
// Parent form has: translations: [{ languageCode, title, seoTitle, seoDescription }]
```

**Page form save flow:**
1. RHF submit → validate with Zod
2. `translations` array built from lang-tabs values
3. `sections` come from Editor.js OutputData.blocks mapped to `{ type, order, content }`
4. POST/PUT to API
5. `toast.success()` + `router.push('/pages')`

**Posts filters (post-list-client.tsx):**
- URL search params: `?status=&category=&tag=&page=`
- `useSearchParams()` to read, `router.push()` to update

---

## Done when
- [ ] `/pages` listing with status badges, edit/delete actions
- [ ] `/pages/new` and `/pages/[id]` forms with Editor.js + multilingual tabs
- [ ] `/posts` listing with filters
- [ ] `/posts/new` and `/posts/[id]` with full form
- [ ] `/categories` with tree view + add/edit
- [ ] `/tags` with list + add/delete
- [ ] Sidebar navigation updated with all links
- [ ] `pnpm --filter m7-cms-web build` + `lint` pass

## Output to orchestrator

```
## F3 Done

### Routes
/pages, /pages/new, /pages/[id]
/posts, /posts/new, /posts/[id]
/categories, /tags

### Shared components created
block-editor.tsx, lang-tabs.tsx, data-table.tsx

### API endpoints consumed
(list all from pages.api.ts, posts.api.ts, etc.)

### Blockers / missing API features
<any>
```
