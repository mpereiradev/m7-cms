# Orchestration Guide — m7-cms Tech Lead

This document is for the orchestrator (Claude acting as tech lead) to spawn and validate specialist agents.

## How to spawn a specialist agent

When a task becomes unblocked (check TaskList), spawn it via the Agent tool:

```
Agent({
  description: "<task subject>",
  prompt: "<paste the full contents of .claude/agents/<agent-file>.md here>",
  isolation: "worktree",  // each agent works on its own branch
})
```

Use `isolation: "worktree"` so each agent creates a separate git branch. After validation, merge manually.

## Parallel execution

When multiple agents are unblocked simultaneously (e.g., B4a + B4b + B4c + B4d), spawn them all in a **single message** with multiple Agent tool calls. Example (do NOT send separate messages):

```
// Message with 4 parallel Agent calls:
Agent({ prompt: contents of B4a-content-module.md, isolation: "worktree" })
Agent({ prompt: contents of B4b-media-module.md, isolation: "worktree" })
Agent({ prompt: contents of B4c-gallery-social-banners-module.md, isolation: "worktree" })
Agent({ prompt: contents of B4d-store-contact-settings-module.md, isolation: "worktree" })
```

## Validation after each agent

After an agent completes, run `/validate-agent-output <module-name>` BEFORE merging its worktree.

If validation passes → merge branch → mark task completed via TaskUpdate → spawn next.
If validation fails → return failed agent the error list.

## Task dependency map

```
[1,2] Setup (this session) ─────────────────────────┐
                                                     │
[B1] infra-schema ──────────────────────────────────►│
     └─[B2] auth ──────────────────────────────────►│
          ├─[B3] tenant-user ─────────────────────►│
          │     ├─[B4a] content    ╮               │
          │     ├─[B4b] media      ╣ parallel      │
          │     ├─[B4c] gallery    ╣               │
          │     └─[B4d] store      ╯               │
          │                                        │
          └─[F1] frontend-setup ──────────────────►│
                └─[F2] frontend-auth (needs B3) ──►│
                      ├─[F3] content pages  ╮     │
                      ├─[F4] media pages    ╣ par │
                      ├─[F5] social/banners ╣     │
                      ├─[F6] stores/users   ╯     │
                      └─[F7] dashboard (needs all B4)
```

## Agent definition files

| File | Task |
|------|------|
| `.claude/agents/B1-infra-schema.md` | Schema + migration + RLS SQL |
| `.claude/agents/B2-auth-module.md` | AuthModule (JWT, guards) |
| `.claude/agents/B3-tenant-user-module.md` | Tenants + Users + invitations |
| `.claude/agents/B4a-content-module.md` | Pages + Posts + Categories + Tags |
| `.claude/agents/B4b-media-module.md` | Media (Supabase Storage) |
| `.claude/agents/B4c-gallery-social-banners-module.md` | Gallery + Social + Banners |
| `.claude/agents/B4d-store-contact-settings-module.md` | Store + Contact + Settings |
| `.claude/agents/F1-frontend-setup.md` | Install deps + configure app |
| `.claude/agents/F2-frontend-auth.md` | Login + middleware + AuthProvider |
| `.claude/agents/F3-frontend-content.md` | Pages/Posts/Categories/Tags admin |
| `.claude/agents/F4-frontend-media.md` | Media library + Gallery admin |
| `.claude/agents/F5-frontend-social-banners.md` | Social + Banners admin |
| `.claude/agents/F6-frontend-store-contact-users-settings.md` | Store/Contact/Users/Settings |
| `.claude/agents/F7-frontend-dashboard.md` | Dashboard stats + charts |

## After each agent completes

1. Read the agent's "Output to orchestrator" section
2. Update `.env` files if new vars are needed
3. Run `/validate-agent-output <module>` on the worktree
4. If APPROVED: `git merge` the worktree branch into main
5. Mark task completed: `TaskUpdate({ taskId: "N", status: "completed" })`
6. Check `TaskList` for newly unblocked tasks
7. Spawn next agent(s)

## Environment variables tracker

| Var | Source | Status |
|-----|--------|--------|
| DATABASE_URL | .env (api) | ✅ set |
| SUPABASE_JWKS_URL | .env (api) | ✅ set |
| SUPABASE_ACCESS_TOKEN | .env (both) | ✅ set |
| SUPABASE_PROJECT_REF | .env (both) | ✅ set |
| NEXT_PUBLIC_MC_API_URL | .env (web) | ✅ set |
| NEXT_PUBLIC_SUPABASE_URL | .env (web) | ✅ set |
| NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY | .env (web) | ✅ set |
| PREVIEW_SECRET | — | ⬜ add after B2 |
| SUPABASE_URL | — | ⬜ add for B4b (=NEXT_PUBLIC_SUPABASE_URL) |
| SUPABASE_SERVICE_ROLE_KEY | — | ⬜ add for B4b + B3 |
| SMTP_HOST / PORT / USER / PASS / FROM | — | ⬜ add before B3 |

## Supabase MCP

MCP configured in `.mcp.json`. Will be active in the NEXT session (restart required after this session).
Use MCP tools to: create tables, manage RLS policies, check migration status, query data.
