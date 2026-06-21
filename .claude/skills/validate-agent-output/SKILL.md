---
name: validate-agent-output
description: Tech-lead validation of a completed feature branch before merge. Checks hexagonal architecture compliance, tenant isolation, type safety, lint, tests, and API contract. Use before approving any agent PR.
---

You are the tech lead reviewing the output of a specialist agent.

Feature/module to validate: $ARGUMENTS

## Phase 1: Read the spec

Read `spec/discovery-back-end.md` or `spec/discovery-front-end.md` (whichever applies) for the section being reviewed. Note what was required.

## Phase 2: Structural checks (API modules)

If this is a backend change, verify:

- [ ] **Layer separation**: domain files import nothing from NestJS or Drizzle. Application files import only from domain and port interfaces. Infrastructure files implement ports and use Drizzle/NestJS.
- [ ] **Tenant isolation**: every Drizzle query that touches a multi-tenant table includes `.where(eq(table.tenantId, tenantId))`. Grep for any query that's missing this.
- [ ] **Port interfaces**: every repository has a corresponding `I<Entity>Repository` interface in `application/ports/`. Drizzle implementation is in `infrastructure/repositories/`.
- [ ] **Controller delegates**: controllers call use-cases only — no business logic or Drizzle imports in controllers.
- [ ] **DTOs validated**: all input DTOs have `class-validator` decorators. The global `ValidationPipe` is in place.

Command to grep for missing tenant filters:
```bash
grep -rn "\.from\|\.select\|\.insert\|\.update\|\.delete" apps/m7-cms-api/src/modules/ | grep -v "tenantId\|tenant_id"
```
Review any matches — some may be legitimate (e.g., joins), but flag anything suspicious.

## Phase 3: Structural checks (web pages)

If this is a frontend change, verify:

- [ ] **Server vs Client**: `page.tsx` has no `useState`/hooks/event handlers. Client components have `'use client'`.
- [ ] **No direct fetch**: all API calls go through `lib/api/<resource>.api.ts`, not `fetch()` directly in components.
- [ ] **Form validation**: all forms use `zodResolver`. No unvalidated form submissions.
- [ ] **RBAC enforced**: destructive actions are wrapped in `<RoleGuard>` or role-checked before rendering.
- [ ] **Tenant ID passed**: every API hook passes `tenantId` from `useAuth()`.

## Phase 4: Quality checks

Run these commands and report results:

```bash
# API
pnpm --filter m7-cms-api lint
pnpm --filter m7-cms-api test
pnpm --filter m7-cms-api build

# Web
pnpm --filter m7-cms-web lint
pnpm --filter m7-cms-web build
```

All must pass. Zero lint errors. Zero type errors. Zero test failures.

## Phase 5: API contract check (if both API and web were changed)

Verify that every API endpoint the web page calls actually exists and has the right shape:
1. List the endpoints the web's `api/<resource>.api.ts` calls
2. Find the corresponding controller in `apps/m7-cms-api/src/modules/`
3. Check that method, path, and DTO fields match

## Phase 6: Security spot-check

- [ ] No secrets or API keys in source files
- [ ] Public endpoints (no auth guard) expose only read-only data
- [ ] File upload endpoints validate MIME type and size

## Output

Produce a report:

```
## Validation Report — <module/feature>

### Pass ✅ / Fail ❌ / Warning ⚠️

| Check | Status | Notes |
|-------|--------|-------|
| Layer separation | ✅ | |
| Tenant isolation | ✅ | |
| Lint | ✅ | |
| Tests | ✅ | |
| Build | ✅ | |
| API contract | ✅ | |
| Security | ✅ | |

### Issues found (if any)

<list specific files and lines with the problem and the fix>

### Verdict

APPROVED / NEEDS FIXES
```

If verdict is NEEDS FIXES, do not merge. List what the implementing agent must fix and re-submit.
