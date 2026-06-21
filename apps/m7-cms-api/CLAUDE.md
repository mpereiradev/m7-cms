# CLAUDE.md — m7-cms-api

NestJS 11 backend for the m7-cms platform. Read the root `CLAUDE.md` first for monorepo conventions.

## Commands

```bash
pnpm start:dev       # dev server with watch
pnpm build           # compile to dist/
pnpm start:prod      # run dist/main.js
pnpm test            # unit tests (Jest)
pnpm test:e2e        # e2e tests (jest --config test/jest-e2e.json)
pnpm test:cov        # coverage
pnpm lint            # eslint --fix
pnpm format          # prettier --write
```

## Hexagonal Architecture

Every module follows three layers. Never import across layers in the wrong direction.

```
src/modules/<module-name>/
  domain/
    entities/          # Plain TS classes, no framework deps
    services/          # Domain logic, pure functions
  application/
    use-cases/         # Orchestrate domain + ports
    ports/             # Interfaces: IRepository, IEmailService, etc.
    dtos/              # Input/output shapes (class-validator)
  infrastructure/
    repositories/      # Drizzle implementations of IRepository
    controllers/       # NestJS @Controller — delegates to use-cases only
    mappers/           # DB row ↔ domain entity
```

Domain layer imports nothing outside itself. Application imports domain only. Infrastructure imports application and framework.

## Drizzle ORM

Schema files live in `src/infrastructure/database/schema/`. One file per domain entity.

```typescript
// Convention for table definitions
export const pages = pgTable('pages', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull(),
  // ...
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
```

Migrations: `pnpm drizzle-kit generate` then `pnpm drizzle-kit migrate`.

## REST API Conventions

- All routes prefixed with `/api/v1`
- Auth routes: `/api/v1/auth/…`
- Admin routes: `/api/v1/<resource>` (require JwtAuthGuard + RolesGuard)
- Public routes: `/api/v1/public/<resource>` (no auth)
- Preview routes: require `?preview_token=<token>`
- Responses: `{ data: T, meta?: PaginationMeta }`
- Errors: NestJS default HttpException shape

## Guards

```typescript
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN, Role.EDITOR)
```

`JwtAuthGuard` validates Supabase JWT **and** reads the `X-Tenant-ID` header. Populates `req.user` with `{ userId, tenantId, role }`. Both token and header must be present on admin routes.

## Email / SMTP

Notifications (contact form, user invitations) use the company's own SMTP server. Config comes from environment variables: `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`. No third-party email SDK — use `nodemailer`.

## Module List

Implement in this order (each depends on the previous):
1. `AuthModule` — JWT validation, preview tokens
2. `TenantsModule` — tenant CRUD, seeding
3. `UsersModule` — user/tenant association, invitations
4. `PagesModule` — pages + sections (JSONB blocks)
5. `PostsModule` — posts, categories, tags
6. `MediaModule` — Supabase Storage integration
7. `GalleryModule` — image + video galleries
8. `SocialModule` — social post URLs
9. `BannersModule` — banner/slide management
10. `StoreModule` — branches + opening hours
11. `ContactFormModule` — form submissions + webhook
12. `SettingsModule` — per-tenant config

## Supabase Integration

- Auth: validate JWT via `@supabase/supabase-js` `auth.getUser(token)`
- Storage: upload via `supabase.storage.from(bucket).upload(path, file)`
- Per-tenant buckets: `media-{tenantId}`
- RLS: set `app.tenant_id` in Postgres session before each query (via Drizzle `db.execute`)

## Validation

Use `class-validator` decorators on DTOs + `ValidationPipe` globally. Never trust client input. Sanitize all string inputs that touch URLs or HTML.

## TypeScript Config Notes

- `noImplicitAny: false` — explicit `any` is allowed but discouraged
- `emitDecoratorMetadata: true` — required for NestJS DI
- `module: nodenext` — use `.js` extension in imports inside `src/`
