# Agent B4b — media-module
## MediaModule: upload Supabase Storage, signed URLs, thumbnails

**Scope:** MediaModule only. Runs parallel with B4a, B4c, B4d.

**Pre-requisite:** B3 complete.

---

## Read (in order, stop when sufficient)

1. `apps/m7-cms-api/CLAUDE.md`
2. `spec/discovery-back-end.md` — section "MediaModule" and "Biblioteca de mídia"
3. `apps/m7-cms-api/src/infrastructure/database/schema/index.ts` — media table
4. `apps/m7-cms-api/.env` — DATABASE_URL (Supabase project ref: hpibhvtjtfudrmpjjnnk)

---

## Install

```bash
pnpm --filter m7-cms-api add @supabase/supabase-js multer sharp
pnpm --filter m7-cms-api add -D @types/multer
```

---

## File structure

```
apps/m7-cms-api/src/modules/media/
  domain/entities/media.entity.ts
  application/
    ports/
      i-media-repository.port.ts
      i-storage.port.ts              ← upload(file, path): Promise<{url, size}>
    use-cases/
      upload-media.use-case.ts       ← upload + generate thumbnail + insert DB row
      list-media.use-case.ts
      delete-media.use-case.ts
      get-signed-url.use-case.ts
    dtos/
      upload-media.dto.ts
      media-response.dto.ts
  infrastructure/
    repositories/drizzle-media.repository.ts
    services/
      supabase-storage.service.ts    ← implements IStoragePort
      image-thumbnail.service.ts     ← uses sharp to resize
    controllers/media.controller.ts
    media.module.ts
```

---

## Key rules

**Bucket naming:** `media-{tenantId}` — create bucket on first upload if it doesn't exist via `supabase.storage.createBucket()`.

**Upload flow:**
1. Receive multipart file via `@UseInterceptors(FileInterceptor('file'))`
2. Validate MIME type: allow `image/*`, `video/*`, `application/pdf`
3. Max size: 50MB
4. Path in bucket: `{year}/{month}/{uuid}.{ext}`
5. If image: generate thumbnail with `sharp` (max 400px wide, same format)
6. Upload original + thumbnail to Supabase Storage (public bucket = public URL)
7. Insert `media` row with: `filename`, `url`, `mimeType`, `size`, `width`, `height`, `tenantId`
8. Return `media` row

**Supabase Storage init:**
```typescript
import { createClient } from '@supabase/supabase-js';
const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
```
Add `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` to .env.

**Signed URLs:** `GET /api/v1/media/:id/signed-url?ttl=3600` — use `supabase.storage.from(bucket).createSignedUrl(path, ttl)`.

## Done when
- [ ] `POST /api/v1/media/upload` accepts multipart, stores in Supabase, returns media row
- [ ] Thumbnail generated for image files
- [ ] `GET /api/v1/media` lists media for current tenant
- [ ] `DELETE /api/v1/media/:id` removes from storage + DB
- [ ] `GET /api/v1/media/:id/signed-url` returns signed URL
- [ ] `pnpm --filter m7-cms-api build` + `lint` pass

## Output to orchestrator

```
## B4b Done

### Endpoints
POST   /api/v1/media/upload          ← multipart/form-data
GET    /api/v1/media
DELETE /api/v1/media/:id
GET    /api/v1/media/:id/signed-url?ttl=

### .env vars needed
SUPABASE_URL=https://hpibhvtjtfudrmpjjnnk.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<service_role_key>

### Blockers
<any>
```
