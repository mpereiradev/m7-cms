---
name: implement-module
description: Scaffold a complete NestJS hexagonal module for the m7-cms-api. Use when asked to implement a new module (Auth, Pages, Posts, Media, etc.). Generates domain entities, application use-cases, repository ports, Drizzle schema + repository, REST controller, and DTOs. Registers the module in AppModule.
---

You are implementing a NestJS module for the m7-cms-api following hexagonal architecture.

Module name: $ARGUMENTS

## Pre-flight: read these files first (in this order, stop when you have enough context)

1. `spec/discovery-back-end.md` — find the section for this module, read the entity fields, use-cases, and endpoints listed
2. `apps/m7-cms-api/CLAUDE.md` — architecture rules and conventions
3. `apps/m7-cms-api/src/app.module.ts` — to know what's already imported
4. One existing module for reference (e.g. `apps/m7-cms-api/src/modules/tenants/` if it exists)

Do NOT read node_modules. Do NOT read files not relevant to this module.

## Scaffold this exact structure

```
apps/m7-cms-api/src/modules/<module-name>/
  domain/
    entities/<entity>.entity.ts
    services/<domain-service>.service.ts   (only if domain logic exists)
  application/
    use-cases/
      create-<entity>.use-case.ts
      update-<entity>.use-case.ts
      delete-<entity>.use-case.ts
      get-<entity>.use-case.ts
      list-<entity>.use-case.ts
    ports/
      i-<entity>-repository.port.ts
    dtos/
      create-<entity>.dto.ts
      update-<entity>.dto.ts
      <entity>-response.dto.ts
  infrastructure/
    repositories/
      drizzle-<entity>.repository.ts
    controllers/
      <entity>.controller.ts
    <module-name>.module.ts
```

Also create/update:
- `apps/m7-cms-api/src/infrastructure/database/schema/<entity>.schema.ts`

## Rules

- Domain entities: plain TypeScript classes, no decorators, no framework imports
- Use-case constructors receive port interfaces (not concrete repos) — NestJS injects via module providers
- All DTOs: use `class-validator` decorators (`@IsString()`, `@IsUUID()`, `@IsOptional()`, etc.)
- All tables must include: `id` (uuid, PK), `tenantId` (uuid, not null), `createdAt`, `updatedAt`
- Drizzle repository must filter by `tenantId` on every query — never omit the tenant filter
- Controller route prefix: `/api/v1/<resource-plural>` — use `@Controller('api/v1/<resource>')`
- Admin endpoints: `@UseGuards(JwtAuthGuard, RolesGuard)` with appropriate `@Roles()`
- Public read endpoints: no auth guard, prefix with `/api/v1/public/`
- Response shape: `{ data: T }` for single, `{ data: T[], meta: { page, perPage, total } }` for lists

## Checklist before finishing

- [ ] All files created in the correct layer
- [ ] Module registered in `apps/m7-cms-api/src/app.module.ts`
- [ ] Drizzle schema added to the schema index
- [ ] Unit test file created for at least one use-case (`*.spec.ts` in application/use-cases/)
- [ ] Run `pnpm --filter m7-cms-api lint` — fix all errors
- [ ] Run `pnpm --filter m7-cms-api test` — no test failures

## Output

After implementing, summarize:
1. Files created (list paths)
2. Endpoints exposed (METHOD /path — description)
3. Anything left for a follow-up (e.g. email integration, webhook triggers)
