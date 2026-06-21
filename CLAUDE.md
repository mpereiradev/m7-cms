# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**m7-cms** — Multi-site CMS platform. Single API instance serves multiple client sites (multi-tenant). Two apps in this monorepo:
- `apps/m7-cms-api` — NestJS 11 backend REST API
- `apps/m7-cms-web` — Next.js 16 admin panel

## Monorepo Tooling

Package manager: **pnpm 11.6+** (workspace monorepo).

```bash
# Run a command in a specific app
pnpm --filter m7-cms-api <command>
pnpm --filter m7-cms-web <command>

# Install a dependency in an app
pnpm --filter m7-cms-api add <package>
pnpm --filter m7-cms-web add -D <package>

# Install workspace deps from root
pnpm install
```

There is no root-level build or test script — always target a specific filter.

## Core Tech Decisions

| Concern | Choice |
|---|---|
| ORM | **Drizzle** (not Prisma, not TypeORM) |
| Database | PostgreSQL via **Supabase** (RLS enabled) |
| Auth | **Supabase Auth** (JWT delegation) |
| File storage | **Supabase Storage** (per-tenant buckets) |
| Backend architecture | **Hexagonal** (domain / application / infrastructure) |
| API style | REST `/api/v1/…` → GraphQL in future phases |

## Multi-Tenancy Rule

Every database table has `tenant_id` (UUID). Every query **must** filter by `tenant_id`. Supabase RLS enforces this at DB level; the application layer must also enforce it in services. Never skip the tenant filter.

**Tenant identification:** via HTTP header `X-Tenant-ID` (UUID). The `JwtAuthGuard` reads this header alongside the JWT and populates `req.user.tenantId`. All admin panel requests must include this header.

## Internationalization

Two languages supported: `pt-BR` (default) and `en`. All translatable content is stored in `*_translations` tables with `language_code` column. API accepts `?lang=pt-BR` filter for public endpoints.

## Git Conventions (GitHub Flow)

- Branch off `main`: `feature/<name>`, `fix/<name>`, `chore/<name>`
- One PR per feature/fix → merge to `main`
- PR titles: `feat: …`, `fix: …`, `chore: …`, `docs: …`
- Never commit directly to `main`

## Agent Orchestration

This project uses specialist sub-agents. The root orchestrator (tech lead) delegates via clean sessions. Skills live in `.claude/skills/`. Invoke them with the slash command or let Claude match automatically.

Key skills:
- `/implement-module` — scaffold a NestJS hexagonal module
- `/implement-page` — scaffold a Next.js admin page
- `/db-migrate` — create and apply a Drizzle migration
- `/commit-push-pr` — conventional commit → push → PR
- `/validate-agent-output` — tech-lead review before merge

## Discovery Specs

Full system specs are in `spec/`:
- `spec/discovery-back-end.md` — API modules, data model, security, roadmap
- `spec/discovery-front-end.md` — Admin panel UX, routes, component patterns

## UI/UX References

Design references go in `.docs/ui-ux/`. The front-end agent builds the Design System from these images progressively. Do not delete files from `.docs/ui-ux/`.

## Subdirectory CLAUDE.md Files

- `apps/m7-cms-api/CLAUDE.md` — NestJS / Drizzle / hexagonal rules
- `apps/m7-cms-web/CLAUDE.md` — Next.js / shadcn/ui / React Query rules
