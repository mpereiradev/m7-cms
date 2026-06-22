# Agent B4d — store-contact-settings-module
## StoreModule + ContactFormModule (SMTP) + SettingsModule

**Scope:** Three modules. Runs parallel with B4a, B4b, B4c.

**Pre-requisite:** B3 complete (nodemailer already installed in B3 — check first, install if not).

---

## Read (in order, stop when sufficient)

1. `apps/m7-cms-api/CLAUDE.md`
2. `spec/discovery-back-end.md` — sections "StoreModule", "ContactFormModule", "SettingsModule"
3. `apps/m7-cms-api/src/infrastructure/database/schema/index.ts` — stores, store_translations, store_hours, contact_form_submissions, settings tables
4. `apps/m7-cms-api/src/modules/users/infrastructure/services/email.service.ts` — reuse if B3 created it, else create EmailService here

---

## File structure

```
apps/m7-cms-api/src/modules/
  stores/
    domain/entities/store.entity.ts
    application/
      ports/i-store-repository.port.ts
      use-cases/
        create-store.use-case.ts
        update-store.use-case.ts
        delete-store.use-case.ts
        list-stores.use-case.ts
        set-store-hours.use-case.ts
      dtos/
        create-store.dto.ts
        store-hours.dto.ts         ← { weekday: 0-6, openTime: 'HH:MM', closeTime: 'HH:MM' }
        store-response.dto.ts
    infrastructure/
      repositories/drizzle-store.repository.ts
      controllers/stores.controller.ts
      stores.module.ts

  contact-form/
    domain/entities/submission.entity.ts
    application/
      ports/
        i-submission-repository.port.ts
        i-webhook.port.ts
      use-cases/
        submit-contact-form.use-case.ts   ← public endpoint
        list-submissions.use-case.ts      ← admin only
        mark-processed.use-case.ts
      dtos/
        contact-form.dto.ts        ← { name, email, subject, message, recaptchaToken? }
        submission-response.dto.ts
    infrastructure/
      repositories/drizzle-submission.repository.ts
      services/
        email-notification.service.ts    ← sends to tenant admin on new submission
        webhook.service.ts               ← reads settings.webhookUrl, fires HTTP POST
      controllers/contact-form.controller.ts
      contact-form.module.ts

  settings/
    domain/entities/setting.entity.ts
    application/
      ports/i-settings-repository.port.ts
      use-cases/
        get-settings.use-case.ts
        update-setting.use-case.ts
        batch-update-settings.use-case.ts
      dtos/
        update-setting.dto.ts       ← { key: string, value: any }
        settings-response.dto.ts
    infrastructure/
      repositories/drizzle-settings.repository.ts
      controllers/settings.controller.ts
      settings.module.ts
```

---

## Key rules

**Contact form submission flow:**
1. `POST /api/v1/public/contact` — no auth guard
2. Validate DTO (class-validator)
3. Insert into `contact_form_submissions`
4. Read `settings` for this tenant: `notification_email`, `webhook_url`
5. Send email via SMTP to `notification_email` (if set)
6. Fire webhook to `webhook_url` with submission JSON (if set)
7. Return `{ success: true }`

**Settings key convention:** `key` is a dot-notation string, `value` is JSONB. Examples:
- `seo.defaultTitle`, `integrations.recaptchaSiteKey`, `notifications.email`, `notifications.webhookUrl`

**Stores translations**: `name`, `address`, `description`, `email`, `phone`, `whatsapp` in `store_translations` with `languageCode`.

## Done when
- [ ] `POST /api/v1/public/contact` stores submission + sends email + fires webhook
- [ ] `GET /api/v1/contact/submissions` lists for current tenant (ADMIN)
- [ ] Stores CRUD + `PUT /api/v1/stores/:id/hours`
- [ ] Settings GET + batch update
- [ ] `pnpm --filter m7-cms-api build` + `lint` pass

## Output to orchestrator

```
## B4d Done

### Endpoints
POST   /api/v1/public/contact
GET    /api/v1/contact/submissions
PUT    /api/v1/contact/submissions/:id/processed
GET|POST   /api/v1/stores
PUT|DELETE /api/v1/stores/:id
PUT        /api/v1/stores/:id/hours
GET        /api/v1/public/stores
GET        /api/v1/settings
PUT        /api/v1/settings
POST       /api/v1/settings/batch

### Blockers
<any>
```
