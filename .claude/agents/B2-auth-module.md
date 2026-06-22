# Agent B2 — auth-module
## AuthModule: JWT (Supabase JWKS) + X-Tenant-ID + Guards + Preview Tokens

**Scope:** Implement the NestJS AuthModule only. No other modules.

**Pre-requisite:** B1 is complete (Drizzle schema exists).

---

## Read (in order, stop when sufficient)

1. `apps/m7-cms-api/CLAUDE.md` — layer rules, guard conventions
2. `apps/m7-cms-api/src/infrastructure/database/schema/index.ts` — tenant_users table (for role lookup)
3. `apps/m7-cms-api/src/infrastructure/database/db.ts` — db singleton
4. `apps/m7-cms-api/.env` — SUPABASE_JWKS_URL

Do NOT read spec/ files beyond what's needed for auth.

---

## Install dependencies

```bash
pnpm --filter m7-cms-api add jwks-rsa jose uuid
pnpm --filter m7-cms-api add @nestjs/passport passport passport-jwt
pnpm --filter m7-cms-api add -D @types/passport-jwt @types/uuid
```

---

## File structure to create

```
apps/m7-cms-api/src/modules/auth/
  domain/
    entities/
      user-context.entity.ts     ← { userId, tenantId, role, email }
  application/
    ports/
      i-auth.port.ts             ← IAuthPort interface
    use-cases/
      validate-jwt.use-case.ts
      generate-preview-token.use-case.ts
      validate-preview-token.use-case.ts
    dtos/
      preview-token.dto.ts
  infrastructure/
    guards/
      jwt-auth.guard.ts          ← JwtAuthGuard
      roles.guard.ts             ← RolesGuard
    decorators/
      roles.decorator.ts         ← @Roles(Role.ADMIN)
      current-user.decorator.ts  ← @CurrentUser()
    strategies/
      supabase-jwt.strategy.ts   ← validates against SUPABASE_JWKS_URL
    services/
      preview-token.service.ts   ← signs/validates preview JWTs (HS256, short TTL)
    controllers/
      auth.controller.ts         ← POST /api/v1/auth/preview-token
    auth.module.ts
```

---

## Key implementations

**JWT validation flow:**
1. Extract `Authorization: Bearer <token>` header
2. Fetch JWKS from `process.env.SUPABASE_JWKS_URL`
3. Verify signature using `jose` or `jwks-rsa`
4. Extract `sub` (userId) and `email` from payload
5. Read `X-Tenant-ID` header → tenantId (UUID)
6. Query `tenant_users` table: `WHERE user_id = sub AND tenant_id = tenantId`
7. Populate `req.user = { userId, tenantId, role, email }`
8. If no tenant_users row → throw `ForbiddenException`

**Preview token:**
- HS256 signed with `process.env.PREVIEW_SECRET` (add to .env)
- Payload: `{ type: 'preview', tenantId, pageId?, exp: +15min }`
- Endpoint: `POST /api/v1/auth/preview-token` (requires ADMIN role)
- Validation: separate guard `PreviewTokenGuard` that accepts query param `?preview_token=`

**Role enum:**
```typescript
export enum Role {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  EDITOR = 'editor',
  AUTHOR = 'author',
  VIEWER = 'viewer',
}
```

---

## Done when
- [ ] `JwtAuthGuard` validates Supabase JWT and reads `X-Tenant-ID`
- [ ] `RolesGuard` + `@Roles()` decorator work
- [ ] `@CurrentUser()` decorator extracts `req.user`
- [ ] `PreviewTokenGuard` validates `?preview_token=` param
- [ ] `POST /api/v1/auth/preview-token` endpoint works
- [ ] `AuthModule` exported and importable by other modules
- [ ] Unit test for `validate-jwt.use-case.ts`
- [ ] `pnpm --filter m7-cms-api build` passes
- [ ] `pnpm --filter m7-cms-api lint` passes

## Output to orchestrator

```
## B2 Done

### Exports from AuthModule
- JwtAuthGuard, RolesGuard, PreviewTokenGuard
- CurrentUser decorator, Roles decorator
- Role enum location: src/modules/auth/domain/entities/...

### Endpoints
POST /api/v1/auth/preview-token → { token: string, expiresAt: string }

### .env vars needed
PREVIEW_SECRET=<random-256bit-hex>

### Blockers
<any>
```
