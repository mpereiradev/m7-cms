# Agent F6 — frontend-store-contact-users-settings
## Stores + Contact submissions + Users + Settings admin pages

**Scope:** Four admin sections. Runs parallel with F3, F4, F5.

**Pre-requisite:** F2 complete + B4d complete + B3 complete.

---

## Read (in order, stop when sufficient)

1. `apps/m7-cms-web/CLAUDE.md`
2. `apps/m7-cms-web/lib/api/client.ts`
3. `.docs/ui-ux/` — stores/settings design references
4. `spec/discovery-front-end.md` — sections "Lojas/Filiais", "Formulários de Contato", "Usuários e Papéis", "Configurações"

---

## File structure

```
apps/m7-cms-web/
  app/(dashboard)/
    stores/
      page.tsx
      new/page.tsx
      [id]/page.tsx
    contact-submissions/page.tsx
    users/page.tsx
    settings/page.tsx

  components/
    stores/
      store-list-client.tsx
      store-form.tsx             ← multilingual tabs + hours manager
      store-hours-manager.tsx    ← 7-day grid: open/close time per weekday
    contact/
      submissions-list-client.tsx ← table with date/subject/status filters
      submission-detail.tsx       ← modal/drawer to read full message
    users/
      users-table.tsx            ← DataTable with role badge + actions
      invite-user-dialog.tsx     ← email input + role select
      change-role-dialog.tsx
    settings/
      settings-form.tsx          ← grouped sections: SEO, integrations, notifications
      settings-section.tsx       ← accordion-style section wrapper

  lib/
    api/
      stores.api.ts
      submissions.api.ts
      users.api.ts               ← listUsers, inviteUser, updateRole, removeUser
      settings.api.ts
    hooks/
      use-stores.ts
      use-submissions.ts
      use-users.ts
      use-settings.ts
    schemas/
      store.schema.ts
      invite-user.schema.ts
      settings.schema.ts
```

---

## Key implementations

**Store hours manager:**
```typescript
// 7 rows (weekdays 0-6), each row: toggle (open/closed) + open time + close time
// Only active days are sent to API
// Type: { weekday: number; openTime: string; closeTime: string }[]
```

**Contact submissions table:**
- Columns: date, name, email, subject, status (new/processed)
- Click row → `SubmissionDetail` drawer shows full message
- "Mark as processed" button → `PUT /api/v1/contact/submissions/:id/processed`
- Filter bar: `?status=&dateFrom=&dateTo=`

**Users table (RBAC aware):**
- Only ADMIN role can see this page (guard in component + middleware)
- Role change: dropdown select with `Role` enum options
- Remove user: confirmation dialog before `DELETE`
- Invite: dialog with email + initial role

**Settings form:**
Group settings by category:
- **SEO**: `seo.defaultTitle`, `seo.defaultDescription`
- **Integrations**: `integrations.googleAnalyticsId`, `integrations.recaptchaSiteKey`
- **Notifications**: `notifications.email`, `notifications.webhookUrl`
On save: `POST /api/v1/settings/batch [{ key, value }]`

---

## Done when
- [ ] `/stores` list + `/stores/new` + `/stores/[id]` with hours manager
- [ ] `/contact-submissions` table with filter + detail drawer
- [ ] `/users` table with invite + role change (ADMIN only)
- [ ] `/settings` form with grouped sections
- [ ] `pnpm --filter m7-cms-web build` + `lint` pass

## Output to orchestrator

```
## F6 Done

### Routes
/stores, /stores/new, /stores/[id]
/contact-submissions
/users (ADMIN only)
/settings

### Blockers
<any>
```
