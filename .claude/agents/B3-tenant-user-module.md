# Agent B3 — tenant-user-module
## TenantsModule + UsersModule (CRUD, invitations, roles)

**Scope:** Implement TenantsModule and UsersModule. Two modules, one agent.

**Pre-requisite:** B2 complete (AuthModule, guards and decorators available).

---

## Read (in order, stop when sufficient)

1. `apps/m7-cms-api/CLAUDE.md` — hexagonal rules, REST conventions
2. `spec/discovery-back-end.md` — sections "TenantsModule" and "UsersModule"
3. `apps/m7-cms-api/src/infrastructure/database/schema/index.ts` — tenants, users, tenant_users tables
4. `apps/m7-cms-api/src/infrastructure/database/db.ts`
5. `apps/m7-cms-api/src/modules/auth/` — guard and decorator exports

Do NOT read other modules or spec sections.

---

## Install

```bash
pnpm --filter m7-cms-api add nodemailer
pnpm --filter m7-cms-api add -D @types/nodemailer
```

---

## File structure

```
apps/m7-cms-api/src/modules/
  tenants/
    domain/entities/tenant.entity.ts
    application/
      ports/i-tenant-repository.port.ts
      use-cases/
        create-tenant.use-case.ts
        get-tenant.use-case.ts
        update-tenant.use-case.ts
        list-tenants.use-case.ts    ← SUPER_ADMIN only
      dtos/
        create-tenant.dto.ts
        update-tenant.dto.ts
        tenant-response.dto.ts
    infrastructure/
      repositories/drizzle-tenant.repository.ts
      controllers/tenants.controller.ts
      tenants.module.ts

  users/
    domain/entities/tenant-user.entity.ts
    application/
      ports/i-user-repository.port.ts
      use-cases/
        list-tenant-users.use-case.ts
        invite-user.use-case.ts
        update-user-role.use-case.ts
        remove-user.use-case.ts
      dtos/
        invite-user.dto.ts
        update-role.dto.ts
        user-response.dto.ts
    infrastructure/
      repositories/drizzle-user.repository.ts
      services/email.service.ts        ← nodemailer SMTP
      controllers/users.controller.ts
      users.module.ts
```

---

## Key rules

- `TenantsController`: all routes require `@Roles(Role.SUPER_ADMIN)` except `GET /api/v1/tenants/:id` (ADMIN of that tenant)
- `UsersController`: `GET /api/v1/users` lists users of `req.user.tenantId`. `POST /api/v1/users/invite` sends email via SMTP. `PUT /api/v1/users/:id/role` requires ADMIN.
- Invitation email uses `nodemailer` with env: `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`
- Invitation inserts into `tenant_users` with role `viewer` + sends email with a Supabase magic link (use `supabase.auth.admin.inviteUserByEmail` — add `@supabase/supabase-js` dependency)
- All `tenant_users` queries must filter by `tenantId`

## Done when
- [ ] `GET /api/v1/tenants/:id` returns tenant
- [ ] `POST /api/v1/tenants` creates tenant (SUPER_ADMIN)
- [ ] `GET /api/v1/users` lists users for current tenant
- [ ] `POST /api/v1/users/invite` sends invitation email
- [ ] `PUT /api/v1/users/:userId/role` updates role
- [ ] `DELETE /api/v1/users/:userId` removes from tenant
- [ ] Unit tests for invite and list use-cases
- [ ] `pnpm --filter m7-cms-api build` + `lint` pass

## Output to orchestrator

```
## B3 Done

### Endpoints
GET    /api/v1/tenants/:id
POST   /api/v1/tenants
PUT    /api/v1/tenants/:id
GET    /api/v1/users
POST   /api/v1/users/invite
PUT    /api/v1/users/:userId/role
DELETE /api/v1/users/:userId

### .env vars needed
SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM
SUPABASE_SERVICE_ROLE_KEY  ← needed for admin invite

### Blockers
<any>
```
