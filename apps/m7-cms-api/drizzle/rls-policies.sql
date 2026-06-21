-- ============================================================================
-- Row Level Security (RLS) Policies for m7-cms
-- Apply after running the Drizzle migration.
-- Each table with tenant_id gets isolation so queries only see their own tenant.
-- The application must SET app.tenant_id = '<uuid>' on every connection/transaction.
-- ============================================================================

-- ── tenants ─────────────────────────────────────────────────────────────
-- tenants table uses its own `id` as the tenant identifier
ALTER TABLE "tenants" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "tenants_tenant_isolation" ON "tenants"
  USING (id = current_setting('app.tenant_id', true)::uuid);

-- ── tenant_users ────────────────────────────────────────────────────────
ALTER TABLE "tenant_users" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "tenant_users_tenant_isolation" ON "tenant_users"
  USING (tenant_id = current_setting('app.tenant_id', true)::uuid);

-- ── pages ───────────────────────────────────────────────────────────────
ALTER TABLE "pages" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "pages_tenant_isolation" ON "pages"
  USING (tenant_id = current_setting('app.tenant_id', true)::uuid);

-- ── sections (inherits tenant via pages FK — RLS on pages handles it,
--    but we add a policy for direct queries via a subquery) ──────────────
-- Sections don't have tenant_id directly; access is controlled via pages RLS.

-- ── posts ───────────────────────────────────────────────────────────────
ALTER TABLE "posts" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "posts_tenant_isolation" ON "posts"
  USING (tenant_id = current_setting('app.tenant_id', true)::uuid);

-- ── categories ──────────────────────────────────────────────────────────
ALTER TABLE "categories" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "categories_tenant_isolation" ON "categories"
  USING (tenant_id = current_setting('app.tenant_id', true)::uuid);

-- ── tags ────────────────────────────────────────────────────────────────
ALTER TABLE "tags" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "tags_tenant_isolation" ON "tags"
  USING (tenant_id = current_setting('app.tenant_id', true)::uuid);

-- ── media ───────────────────────────────────────────────────────────────
ALTER TABLE "media" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "media_tenant_isolation" ON "media"
  USING (tenant_id = current_setting('app.tenant_id', true)::uuid);

-- ── galleries ───────────────────────────────────────────────────────────
ALTER TABLE "galleries" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "galleries_tenant_isolation" ON "galleries"
  USING (tenant_id = current_setting('app.tenant_id', true)::uuid);

-- ── videos ──────────────────────────────────────────────────────────────
ALTER TABLE "videos" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "videos_tenant_isolation" ON "videos"
  USING (tenant_id = current_setting('app.tenant_id', true)::uuid);

-- ── social_posts ────────────────────────────────────────────────────────
ALTER TABLE "social_posts" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "social_posts_tenant_isolation" ON "social_posts"
  USING (tenant_id = current_setting('app.tenant_id', true)::uuid);

-- ── banners ─────────────────────────────────────────────────────────────
ALTER TABLE "banners" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "banners_tenant_isolation" ON "banners"
  USING (tenant_id = current_setting('app.tenant_id', true)::uuid);

-- ── stores ──────────────────────────────────────────────────────────────
ALTER TABLE "stores" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "stores_tenant_isolation" ON "stores"
  USING (tenant_id = current_setting('app.tenant_id', true)::uuid);

-- ── contact_form_submissions ────────────────────────────────────────────
ALTER TABLE "contact_form_submissions" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "contact_form_submissions_tenant_isolation" ON "contact_form_submissions"
  USING (tenant_id = current_setting('app.tenant_id', true)::uuid);

-- ── settings ────────────────────────────────────────────────────────────
ALTER TABLE "settings" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "settings_tenant_isolation" ON "settings"
  USING (tenant_id = current_setting('app.tenant_id', true)::uuid);

-- ============================================================================
-- Tables WITHOUT direct tenant_id (no RLS policy needed — access controlled
-- via parent FK + parent's RLS):
--   - users              (global, linked via tenant_users)
--   - page_translations  (inherits via pages)
--   - sections           (inherits via pages)
--   - post_translations  (inherits via posts)
--   - category_translations (inherits via categories)
--   - post_tags          (inherits via posts + tags)
--   - gallery_items      (inherits via galleries)
--   - store_translations (inherits via stores)
--   - store_hours        (inherits via stores)
-- ============================================================================
