# Agent F2 — frontend-auth
## Login page, middleware, AuthProvider, TenantSelector

**Scope:** Authentication UX only. No content pages.

**Pre-requisite:** F1 complete (shadcn + Supabase SSR installed) + B3 complete (users/tenants API ready).

---

## Read (in order, stop when sufficient)

1. `apps/m7-cms-web/CLAUDE.md` — RBAC, auth conventions
2. `apps/m7-cms-web/lib/supabase/client.ts` and `server.ts`
3. `apps/m7-cms-web/lib/api/client.ts`
4. `apps/m7-cms-web/app/layout.tsx`
5. `.docs/ui-ux/` — any login/auth screen references (if files exist)

---

## Files to create

```
apps/m7-cms-web/
  middleware.ts                              ← auth redirect guard
  app/
    (auth)/
      layout.tsx                            ← minimal layout (no sidebar)
      login/
        page.tsx
        login-form.tsx                      ← 'use client', RHF + Zod
      forgot-password/
        page.tsx
        forgot-password-form.tsx
  components/
    providers/
      auth-provider.tsx                     ← 'use client', exposes useAuth()
    tenant-selector/
      tenant-selector.tsx                   ← modal shown after login if >1 tenant
  lib/
    api/
      auth.api.ts                           ← getMyTenants(): Tenant[]
    hooks/
      use-auth.ts                           ← reads AuthContext
  types/
    auth.ts                                 ← UserContext type: { userId, tenantId, role, email }
```

---

## Key implementations

**middleware.ts:**
```typescript
import { createSupabaseMiddleware } from '@/lib/supabase/middleware';
// Check session. If no session → redirect to /login
// If session but no X-Tenant-ID cookie → redirect to /select-tenant (or show selector)
// Set X-Tenant-ID in request headers for API calls
```

**AuthProvider:**
- Reads Supabase session on mount
- Calls `GET /api/v1/users/me` to get `{ userId, tenantId, role }`
- Exposes `useAuth()` hook: `{ user, tenantId, role, isLoading, signOut }`

**TenantSelector:**
- If user has multiple tenants (from `/api/v1/users/my-tenants`), show modal to pick one
- After selection: store `tenantId` in cookie `m7_tenant_id` + reload

**Login form:**
- Zod schema: `{ email: z.string().email(), password: z.string().min(8) }`
- On submit: `supabase.auth.signInWithPassword({ email, password })`
- On success: `router.push('/dashboard')`
- Error: show `toast.error(message)`

**Forgot password:**
- `supabase.auth.resetPasswordForEmail(email, { redirectTo: '/reset-password' })`

**RoleGuard component:**
```typescript
// components/role-guard.tsx
// 'use client'
// If useAuth().role not in roles prop → return null (or fallback)
export function RoleGuard({ roles, children, fallback }: RoleGuardProps)
```

---

## Done when
- [ ] `middleware.ts` redirects unauthenticated users to `/login`
- [ ] Login page works with Supabase auth
- [ ] `AuthProvider` exposes `useAuth()` with user context
- [ ] `RoleGuard` component works
- [ ] Tenant selector shown when user has multiple tenants
- [ ] `pnpm --filter m7-cms-web build` + `lint` pass

## Output to orchestrator

```
## F2 Done

### Routes created
/login, /forgot-password

### Exported hooks/components
- useAuth() → { user, tenantId, role, signOut, isLoading }
- RoleGuard component at components/role-guard.tsx
- Cookie used for tenant: m7_tenant_id

### API endpoints consumed
GET /api/v1/users/me
GET /api/v1/users/my-tenants

### Blockers
<any>
```
