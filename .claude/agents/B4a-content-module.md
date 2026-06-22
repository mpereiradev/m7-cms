# Agent B4a — content-module
## PagesModule + PostsModule (pages, sections, posts, categories, tags, translations)

**Scope:** Two content modules. Can run in parallel with B4b, B4c, B4d.

**Pre-requisite:** B3 complete (tenant context + auth guards available).

---

## Read (in order, stop when sufficient)

1. `apps/m7-cms-api/CLAUDE.md` — hexagonal rules
2. `spec/discovery-back-end.md` — sections "PagesModule" and "PostsModule"
3. `apps/m7-cms-api/src/infrastructure/database/schema/index.ts` — pages, page_translations, sections, posts, post_translations, categories, category_translations, tags, post_tags tables
4. `apps/m7-cms-api/src/modules/auth/infrastructure/guards/` — guard imports

---

## File structure

```
apps/m7-cms-api/src/modules/
  pages/
    domain/entities/page.entity.ts
    application/
      ports/i-page-repository.port.ts
      use-cases/
        create-page.use-case.ts
        update-page.use-case.ts
        publish-page.use-case.ts
        delete-page.use-case.ts
        get-page.use-case.ts          ← includes sections + translations
        list-pages.use-case.ts
        add-section.use-case.ts
        reorder-sections.use-case.ts
      dtos/
        create-page.dto.ts            ← { slug, translations: [{languageCode, title, seoTitle, seoDescription}] }
        create-section.dto.ts         ← { type, order, content: object }
        page-response.dto.ts
    infrastructure/
      repositories/drizzle-page.repository.ts
      controllers/pages.controller.ts
      pages.module.ts

  posts/
    domain/entities/post.entity.ts
    application/
      ports/i-post-repository.port.ts
      use-cases/
        create-post.use-case.ts
        update-post.use-case.ts
        publish-post.use-case.ts
        schedule-post.use-case.ts
        delete-post.use-case.ts
        get-post.use-case.ts
        list-posts.use-case.ts        ← filters: status, category, tag, lang, date
        create-category.use-case.ts
        list-categories.use-case.ts
        create-tag.use-case.ts
        list-tags.use-case.ts
      dtos/
        create-post.dto.ts
        list-posts-filter.dto.ts
        post-response.dto.ts
        create-category.dto.ts
        create-tag.dto.ts
    infrastructure/
      repositories/
        drizzle-post.repository.ts
        drizzle-category.repository.ts
        drizzle-tag.repository.ts
      controllers/
        posts.controller.ts
        categories.controller.ts
        tags.controller.ts
      posts.module.ts
```

---

## Key rules

- Sections `content` field is JSONB — store Editor.js JSON as-is, do NOT validate structure
- `GET /api/v1/public/pages/:slug?lang=pt-BR` — public, no auth, returns page + sections + translation for lang
- `GET /api/v1/pages/:id?preview_token=<token>` — accepts PreviewTokenGuard for drafts
- Posts: `status` enum `draft | published | scheduled`. `publishedAt` set when publishing.
- List posts: accept `?status=&category=&tag=&lang=&page=&perPage=&sort=`
- Categories: hierarchical via `parentId`. Return as flat list with depth indicator.
- All tenant filters MUST be applied — never return cross-tenant data

## Done when
- [ ] Pages CRUD + sections CRUD endpoints working
- [ ] Public page endpoint returns translated content for ?lang=
- [ ] Posts CRUD with draft/publish/schedule workflow
- [ ] Categories + tags CRUD
- [ ] `GET /api/v1/public/posts?lang=` lists published posts
- [ ] Unit tests for publish-page and schedule-post use-cases
- [ ] `pnpm --filter m7-cms-api build` + `lint` pass

## Output to orchestrator

```
## B4a Done

### Endpoints
GET|POST       /api/v1/pages
GET|PUT|DELETE /api/v1/pages/:id
POST           /api/v1/pages/:id/sections
PUT            /api/v1/pages/:id/sections/reorder
GET            /api/v1/public/pages/:slug?lang=
GET|POST       /api/v1/posts
GET|PUT|DELETE /api/v1/posts/:id
POST           /api/v1/posts/:id/publish
GET|POST       /api/v1/categories
GET|POST       /api/v1/tags
GET            /api/v1/public/posts?lang=&category=&tag=

### Blockers
<any>
```
