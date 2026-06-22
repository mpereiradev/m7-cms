# Agent B4c — gallery-social-banners-module
## GalleryModule + SocialModule + BannersModule

**Scope:** Three related modules. Runs parallel with B4a, B4b, B4d.

**Pre-requisite:** B3 complete. B4b complete is NOT required (media_id is a UUID FK, use nullable FK if media not uploaded yet).

---

## Read (in order, stop when sufficient)

1. `apps/m7-cms-api/CLAUDE.md`
2. `spec/discovery-back-end.md` — sections "GalleryModule", "SocialModule", "BannersModule"
3. `apps/m7-cms-api/src/infrastructure/database/schema/index.ts` — galleries, gallery_items, videos, social_posts, banners tables

---

## File structure

```
apps/m7-cms-api/src/modules/
  gallery/
    domain/entities/
      gallery.entity.ts
      gallery-item.entity.ts
      video.entity.ts
    application/
      ports/i-gallery-repository.port.ts
      use-cases/
        create-gallery.use-case.ts
        add-gallery-item.use-case.ts
        reorder-gallery-items.use-case.ts
        delete-gallery-item.use-case.ts
        list-galleries.use-case.ts
        create-video.use-case.ts
        list-videos.use-case.ts
        reorder-videos.use-case.ts
      dtos/
        create-gallery.dto.ts
        add-gallery-item.dto.ts     ← { mediaId, caption?: Record<string,string> }
        create-video.dto.ts         ← { sourceType: 'youtube'|'vimeo'|'local', url, title, thumbnailMediaId? }
        gallery-response.dto.ts
    infrastructure/
      repositories/drizzle-gallery.repository.ts
      controllers/
        galleries.controller.ts
        videos.controller.ts
      gallery.module.ts

  social/
    domain/entities/social-post.entity.ts
    application/
      ports/i-social-repository.port.ts
      use-cases/
        create-social-post.use-case.ts
        list-social-posts.use-case.ts
        update-social-post.use-case.ts
        delete-social-post.use-case.ts
        reorder-social-posts.use-case.ts
      dtos/
        create-social-post.dto.ts   ← validate platform enum + URL format
        social-post-response.dto.ts
    infrastructure/
      repositories/drizzle-social.repository.ts
      controllers/social.controller.ts
      social.module.ts

  banners/
    domain/entities/banner.entity.ts
    application/
      ports/i-banner-repository.port.ts
      use-cases/
        create-banner.use-case.ts
        update-banner.use-case.ts
        delete-banner.use-case.ts
        list-banners.use-case.ts
        list-active-banners.use-case.ts   ← filters by displayStart/End dates
      dtos/
        create-banner.dto.ts
        banner-response.dto.ts
    infrastructure/
      repositories/drizzle-banner.repository.ts
      controllers/banners.controller.ts
      banners.module.ts
```

---

## Key rules

- **Platforms enum** for social_posts: `facebook | instagram | linkedin | pinterest | tiktok | twitter | youtube`
- **Active banners** public endpoint: `GET /api/v1/public/banners?tenantSlug=` — filters `displayStart <= now <= displayEnd`
- **Gallery items** have `caption` as JSONB: `{ "pt-BR": "...", "en": "..." }`
- **Video `sourceType`**: `youtube | vimeo | local`. For youtube/vimeo only store URL + title. No embedding logic in API.
- **Reorder** endpoints accept `{ ids: string[] }` in new order, update `order` field for each.
- All `tenantId` filters mandatory.

## Done when
- [ ] Gallery CRUD + item add/reorder/delete
- [ ] Video CRUD + reorder
- [ ] Social posts CRUD + reorder
- [ ] Banners CRUD + `GET /api/v1/public/banners` active filter
- [ ] `pnpm --filter m7-cms-api build` + `lint` pass

## Output to orchestrator

```
## B4c Done

### Endpoints
GET|POST            /api/v1/galleries
GET|DELETE          /api/v1/galleries/:id
POST                /api/v1/galleries/:id/items
PUT                 /api/v1/galleries/:id/items/reorder
DELETE              /api/v1/galleries/:galleryId/items/:itemId
GET|POST            /api/v1/videos
PUT|DELETE          /api/v1/videos/:id
PUT                 /api/v1/videos/reorder
GET|POST            /api/v1/social-posts
PUT|DELETE          /api/v1/social-posts/:id
PUT                 /api/v1/social-posts/reorder
GET|POST            /api/v1/banners
PUT|DELETE          /api/v1/banners/:id
GET                 /api/v1/public/banners

### Blockers
<any>
```
