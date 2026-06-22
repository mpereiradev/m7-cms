# Agent F7 — frontend-dashboard
## Dashboard: stats, charts, notifications

**Scope:** `/dashboard` page only. Runs last (after all other frontend agents done).

**Pre-requisite:** F2 complete + all B4 modules complete (all backend API endpoints available).

---

## Read (in order, stop when sufficient)

1. `apps/m7-cms-web/CLAUDE.md`
2. `apps/m7-cms-web/lib/api/client.ts`
3. `apps/m7-cms-web/app/(dashboard)/layout.tsx` — existing sidebar structure
4. `.docs/ui-ux/` — dashboard design references
5. `spec/discovery-front-end.md` — section "Dashboard"

---

## File structure

```
apps/m7-cms-web/
  app/(dashboard)/
    dashboard/
      page.tsx                       ← Server Component, passes data to client
      dashboard-client.tsx           ← 'use client', stats + chart

  components/
    dashboard/
      stats-card.tsx                 ← shadcn Card with icon + number + label
      activity-chart.tsx             ← Recharts BarChart or LineChart
      scheduled-posts-list.tsx       ← list of posts with publishedAt in future
      recent-submissions-list.tsx    ← last 5 contact form submissions
      quick-actions.tsx              ← shortcut buttons: New Page, New Post, Upload

  lib/
    api/
      dashboard.api.ts               ← getDashboardStats()
    hooks/
      use-dashboard.ts
```

---

## Stats to display (via dedicated API endpoint or parallel queries)

Implement `GET /api/v1/dashboard/stats` in the backend **if it doesn't exist** — create a minimal controller+use-case that returns:
```json
{
  "pages": { "total": 12, "published": 10, "draft": 2 },
  "posts": { "total": 45, "published": 40, "draft": 3, "scheduled": 2 },
  "activeBanners": 3,
  "recentSubmissions": 8,
  "scheduledPosts": [{ "id", "title", "publishedAt" }]
}
```

If adding this backend endpoint, create it in `apps/m7-cms-api/src/modules/` as a lightweight `DashboardModule` with a single controller — no hexagonal layers needed for this aggregation endpoint.

---

## Key implementations

**Stats cards row:**
4 cards: Total Pages | Total Posts | Active Banners | New Submissions

**Activity chart:**
- BarChart: posts published per month (last 6 months)
- Use Recharts `<BarChart>`, `<Bar>`, `<XAxis>`, `<YAxis>`, `<Tooltip>`
- Data from `getDashboardStats()` or a separate `GET /api/v1/dashboard/activity?months=6`

**Scheduled posts notification:**
- Yellow badge in header: "2 posts scheduled for publishing"
- Click → opens `ScheduledPostsList` drawer

---

## Done when
- [ ] `/dashboard` shows 4 stat cards with real data
- [ ] Activity bar chart renders
- [ ] Scheduled posts section shows upcoming posts
- [ ] Recent submissions listed
- [ ] Quick action buttons navigate to create pages
- [ ] `pnpm --filter m7-cms-web build` + `lint` pass

## Output to orchestrator

```
## F7 Done

### Routes
/dashboard

### Backend addition (if needed)
GET /api/v1/dashboard/stats

### Blockers
<any>
```
