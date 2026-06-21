// ── Table exports ──────────────────────────────────────────────────────
export { tenants } from './tenants.schema.js';
export { users } from './users.schema.js';
export { tenantUsers, userRoleEnum } from './tenant-users.schema.js';
export { pages, pageStatusEnum } from './pages.schema.js';
export { pageTranslations } from './page-translations.schema.js';
export { sections } from './sections.schema.js';
export { posts, postStatusEnum } from './posts.schema.js';
export { postTranslations } from './post-translations.schema.js';
export { categories } from './categories.schema.js';
export { categoryTranslations } from './category-translations.schema.js';
export { tags } from './tags.schema.js';
export { postTags } from './post-tags.schema.js';
export { media } from './media.schema.js';
export { galleries } from './galleries.schema.js';
export { galleryItems } from './gallery-items.schema.js';
export { videos, videoSourceTypeEnum } from './videos.schema.js';
export { socialPosts, socialPlatformEnum } from './social-posts.schema.js';
export { banners } from './banners.schema.js';
export { stores } from './stores.schema.js';
export { storeTranslations } from './store-translations.schema.js';
export { storeHours } from './store-hours.schema.js';
export { contactFormSubmissions } from './contact-form-submissions.schema.js';
export { settings } from './settings.schema.js';

// ── Inferred types ────────────────────────────────────────────────────
import type { tenants } from './tenants.schema.js';
import type { users } from './users.schema.js';
import type { tenantUsers } from './tenant-users.schema.js';
import type { pages } from './pages.schema.js';
import type { pageTranslations } from './page-translations.schema.js';
import type { sections } from './sections.schema.js';
import type { posts } from './posts.schema.js';
import type { postTranslations } from './post-translations.schema.js';
import type { categories } from './categories.schema.js';
import type { categoryTranslations } from './category-translations.schema.js';
import type { tags } from './tags.schema.js';
import type { postTags } from './post-tags.schema.js';
import type { media } from './media.schema.js';
import type { galleries } from './galleries.schema.js';
import type { galleryItems } from './gallery-items.schema.js';
import type { videos } from './videos.schema.js';
import type { socialPosts } from './social-posts.schema.js';
import type { banners } from './banners.schema.js';
import type { stores } from './stores.schema.js';
import type { storeTranslations } from './store-translations.schema.js';
import type { storeHours } from './store-hours.schema.js';
import type { contactFormSubmissions } from './contact-form-submissions.schema.js';
import type { settings } from './settings.schema.js';

// Tenant
export type Tenant = typeof tenants.$inferSelect;
export type NewTenant = typeof tenants.$inferInsert;

// User
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

// TenantUser
export type TenantUser = typeof tenantUsers.$inferSelect;
export type NewTenantUser = typeof tenantUsers.$inferInsert;

// Page
export type Page = typeof pages.$inferSelect;
export type NewPage = typeof pages.$inferInsert;

// PageTranslation
export type PageTranslation = typeof pageTranslations.$inferSelect;
export type NewPageTranslation = typeof pageTranslations.$inferInsert;

// Section
export type Section = typeof sections.$inferSelect;
export type NewSection = typeof sections.$inferInsert;

// Post
export type Post = typeof posts.$inferSelect;
export type NewPost = typeof posts.$inferInsert;

// PostTranslation
export type PostTranslation = typeof postTranslations.$inferSelect;
export type NewPostTranslation = typeof postTranslations.$inferInsert;

// Category
export type Category = typeof categories.$inferSelect;
export type NewCategory = typeof categories.$inferInsert;

// CategoryTranslation
export type CategoryTranslation = typeof categoryTranslations.$inferSelect;
export type NewCategoryTranslation = typeof categoryTranslations.$inferInsert;

// Tag
export type Tag = typeof tags.$inferSelect;
export type NewTag = typeof tags.$inferInsert;

// PostTag
export type PostTag = typeof postTags.$inferSelect;
export type NewPostTag = typeof postTags.$inferInsert;

// Media
export type Media = typeof media.$inferSelect;
export type NewMedia = typeof media.$inferInsert;

// Gallery
export type Gallery = typeof galleries.$inferSelect;
export type NewGallery = typeof galleries.$inferInsert;

// GalleryItem
export type GalleryItem = typeof galleryItems.$inferSelect;
export type NewGalleryItem = typeof galleryItems.$inferInsert;

// Video
export type Video = typeof videos.$inferSelect;
export type NewVideo = typeof videos.$inferInsert;

// SocialPost
export type SocialPost = typeof socialPosts.$inferSelect;
export type NewSocialPost = typeof socialPosts.$inferInsert;

// Banner
export type Banner = typeof banners.$inferSelect;
export type NewBanner = typeof banners.$inferInsert;

// Store
export type Store = typeof stores.$inferSelect;
export type NewStore = typeof stores.$inferInsert;

// StoreTranslation
export type StoreTranslation = typeof storeTranslations.$inferSelect;
export type NewStoreTranslation = typeof storeTranslations.$inferInsert;

// StoreHours
export type StoreHour = typeof storeHours.$inferSelect;
export type NewStoreHour = typeof storeHours.$inferInsert;

// ContactFormSubmission
export type ContactFormSubmission = typeof contactFormSubmissions.$inferSelect;
export type NewContactFormSubmission =
  typeof contactFormSubmissions.$inferInsert;

// Setting
export type Setting = typeof settings.$inferSelect;
export type NewSetting = typeof settings.$inferInsert;
