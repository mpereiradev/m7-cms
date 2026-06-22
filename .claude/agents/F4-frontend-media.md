# Agent F4 — frontend-media
## Media uploader + Image galleries + Video galleries admin

**Scope:** MediaUploader component + gallery admin pages. Runs parallel with F3, F5, F6.

**Pre-requisite:** F2 complete + B4b and B4c complete (media + gallery API ready).

---

## Read (in order, stop when sufficient)

1. `apps/m7-cms-web/CLAUDE.md`
2. `apps/m7-cms-web/lib/api/client.ts`
3. `.docs/ui-ux/` — gallery/media design references
4. `spec/discovery-front-end.md` — sections "Galerias de Imagens", "Galerias de Vídeos"

---

## File structure

```
apps/m7-cms-web/
  app/(dashboard)/
    media/page.tsx                    ← media library grid
    galleries/
      images/
        page.tsx
        [id]/page.tsx                 ← gallery detail + item manager
      videos/
        page.tsx
        new/page.tsx
        [id]/page.tsx

  components/
    media/
      media-uploader.tsx              ← 'use client', drag-drop + browse, progress bar
      media-grid.tsx                  ← grid of MediaItem cards
      media-picker.tsx                ← modal to select existing media (used in forms)
    galleries/
      gallery-list-client.tsx
      gallery-form.tsx
      gallery-items-manager.tsx       ← dnd-kit sortable list + add/remove items
    videos/
      video-list-client.tsx
      video-form.tsx                  ← URL input + type detection (youtube/vimeo/local)

  lib/
    api/
      media.api.ts                    ← uploadMedia(file), listMedia, deleteMedia
      galleries.api.ts
      videos.api.ts
    hooks/
      use-media.ts
      use-galleries.ts
      use-videos.ts
```

---

## Key implementations

**MediaUploader:**
```typescript
// Props: { onUpload: (media: Media) => void; accept?: string; maxSizeMB?: number }
// - Input[type=file] + drag-over zone
// - On select: call POST /api/v1/media/upload with multipart FormData
// - Show progress via XHR (not fetch) to get progress events
// - On success: show thumbnail preview + call onUpload(media)
// - On error: toast.error(message)
```

**GalleryItemsManager (dnd-kit):**
```typescript
// 'use client'
// Uses @dnd-kit/sortable SortableContext
// Each item: image thumbnail + caption input + delete button
// onDragEnd → reorder array → PATCH /api/v1/galleries/:id/items/reorder
```

**MediaPicker:**
- Modal with `GET /api/v1/media` grid
- Search by filename
- Click to select → returns `mediaId`
- Used in page forms, post forms, banner forms (reusable)

**Video form:**
- URL input → detect if youtube/vimeo/local via regex
- YouTube: extract thumbnail from `img.youtube.com/vi/{id}/0.jpg`
- Vimeo: use `vimeo.com/api/v2/video/{id}.json` (client-side)

---

## Done when
- [ ] `MediaUploader` uploads files with progress + preview
- [ ] `/media` page shows library grid with delete
- [ ] `/galleries/images` lists galleries + item count
- [ ] `/galleries/images/[id]` shows draggable items + add more
- [ ] `/galleries/videos` + `/galleries/videos/[id]` work
- [ ] `MediaPicker` modal reusable from other forms
- [ ] `pnpm --filter m7-cms-web build` + `lint` pass

## Output to orchestrator

```
## F4 Done

### Routes
/media, /galleries/images, /galleries/images/[id]
/galleries/videos, /galleries/videos/new, /galleries/videos/[id]

### Reusable components
components/media/media-uploader.tsx
components/media/media-picker.tsx  ← used by post-form, banner-form, etc.

### Blockers
<any>
```
