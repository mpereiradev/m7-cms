# Agent F5 — frontend-social-banners
## Social posts admin + Banners/slides admin

**Scope:** Two admin sections. Runs parallel with F3, F4, F6.

**Pre-requisite:** F2 complete + B4c complete.

---

## Read (in order, stop when sufficient)

1. `apps/m7-cms-web/CLAUDE.md`
2. `apps/m7-cms-web/lib/api/client.ts`
3. `.docs/ui-ux/` — social/banners design references
4. `spec/discovery-front-end.md` — sections "Publicações de Mídias Sociais", "Banners/Slides"

If `components/media/media-picker.tsx` exists (created by F4): import it for banner image selection.
If NOT yet created: create a simple inline image URL input instead, and leave a TODO comment.

---

## File structure

```
apps/m7-cms-web/
  app/(dashboard)/
    social/
      page.tsx
    banners/
      page.tsx
      new/page.tsx
      [id]/page.tsx

  components/
    social/
      social-list-client.tsx         ← drag-to-reorder list, activate/deactivate toggle
      social-form.tsx                ← URL input + platform badge auto-detected
      social-embed-preview.tsx       ← shows platform icon + URL
    banners/
      banner-list-client.tsx
      banner-form.tsx                ← image picker + title + CTA + date range picker
      banner-preview.tsx             ← simple visual preview card

  lib/
    api/
      social-posts.api.ts
      banners.api.ts
    hooks/
      use-social-posts.ts
      use-banners.ts
    schemas/
      social-post.schema.ts
      banner.schema.ts
```

---

## Key implementations

**Platform detection (social-form.tsx):**
```typescript
const detectPlatform = (url: string): Platform => {
  if (/instagram\.com/.test(url)) return 'instagram';
  if (/facebook\.com|fb\.com/.test(url)) return 'facebook';
  if (/tiktok\.com/.test(url)) return 'tiktok';
  if (/twitter\.com|x\.com/.test(url)) return 'twitter';
  if (/linkedin\.com/.test(url)) return 'linkedin';
  if (/youtube\.com|youtu\.be/.test(url)) return 'youtube';
  if (/pinterest\.com/.test(url)) return 'pinterest';
  return 'unknown';
};
```

**Social list reorder:**
- Uses dnd-kit SortableContext (same pattern as F4 gallery items)
- On reorder: `PUT /api/v1/social-posts/reorder { ids: string[] }`

**Banner form date range:**
- Two `<Input type="datetime-local">` fields for `displayStart` and `displayEnd`
- Use shadcn `Calendar` if available, else input[type=datetime-local]

**Banner preview card:**
- Shows image (if mediaId) or placeholder
- Title overlay + CTA button label
- `active` badge if current date is within display range

---

## Done when
- [ ] `/social` lists all social posts, drag to reorder, toggle active
- [ ] Add social post: URL input → auto-detect platform → save
- [ ] `/banners` lists banners with status (active/scheduled/expired)
- [ ] `/banners/new` and `/banners/[id]` forms with preview
- [ ] `pnpm --filter m7-cms-web build` + `lint` pass

## Output to orchestrator

```
## F5 Done

### Routes
/social, /banners, /banners/new, /banners/[id]

### Blockers / missing API features
<any>
```
