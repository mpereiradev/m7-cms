---
name: commit-push-pr
description: Stage relevant files, create a conventional commit, push the feature branch, and open a GitHub PR with a structured description. Use after completing a feature or fix. Requires gh CLI.
disable-model-invocation: true
---

You are creating a commit, pushing a branch, and opening a GitHub PR.

Scope/description: $ARGUMENTS

## Steps

### 1. Check status

```bash
git status
git diff --stat
```

Identify which files belong to this change. Do NOT stage unrelated files.

### 2. Determine commit type

Choose from: `feat`, `fix`, `chore`, `refactor`, `test`, `docs`, `ci`.

Format: `<type>(<scope>): <short description in English, present tense, ≤72 chars>`

Examples:
- `feat(pages): implement CRUD endpoints with hexagonal layers`
- `fix(auth): correct JWT tenant_id extraction from claims`
- `chore(deps): add drizzle-orm and drizzle-kit`

### 3. Stage files

Stage only files relevant to this change:
```bash
git add <file1> <file2> …
```

Never `git add .` or `git add -A` — it may include `.env`, generated files, or unrelated changes.

### 4. Commit

```bash
git commit -m "$(cat <<'EOF'
<type>(<scope>): <description>

<optional body — what changed and why, if non-obvious>

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

### 5. Push

```bash
git push -u origin HEAD
```

### 6. Open PR

```bash
gh pr create \
  --title "<same as commit title>" \
  --body "$(cat <<'EOF'
## Summary

- <bullet: what changed>
- <bullet: why / what problem it solves>

## Module / Route

<which NestJS module or Next.js route was affected>

## Test plan

- [ ] Unit tests pass (`pnpm --filter <app> test`)
- [ ] Lint passes (`pnpm --filter <app> lint`)
- [ ] Manual test: <describe the manual verification step>

## Checklist

- [ ] Follows hexagonal layer rules (API) or component conventions (web)
- [ ] All queries filter by `tenant_id`
- [ ] No `.env` or secrets committed

🤖 Generated with [Claude Code](https://claude.ai/code)
EOF
)"
```

## Output

Print the PR URL when done.
