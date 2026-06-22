import { Controller, Get, UseGuards } from '@nestjs/common';
import { eq, and, sql, gte, lte } from 'drizzle-orm';
import {
  JwtAuthGuard,
  RolesGuard,
  CurrentUser,
  UserContext,
} from '../../../auth/infrastructure/auth.module.js';
import { db } from '../../../../infrastructure/database/db.js';
import {
  pages,
  posts,
  banners,
  contactFormSubmissions,
  postTranslations,
} from '../../../../infrastructure/database/schema/index.js';

type DashboardStats = {
  totalPages: number;
  totalPosts: number;
  activeBanners: number;
  newSubmissions: number;
  scheduledPosts: {
    id: string;
    slug: string;
    title: string | null;
    publishedAt: string | null;
  }[];
  postsPerMonth: { month: string; count: number }[];
  recentSubmissions: {
    id: string;
    name: string;
    email: string;
    subject: string | null;
    submittedAt: string;
  }[];
};

@Controller('api/v1/dashboard')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DashboardController {
  @Get('stats')
  async getStats(
    @CurrentUser() user: UserContext,
  ): Promise<{ data: DashboardStats }> {
    const tenantId = user.tenantId;
    const now = new Date();

    // Run all queries in parallel
    const [
      pagesCount,
      postsCount,
      activeBannersCount,
      newSubmissionsCount,
      scheduledPostsResult,
      postsPerMonthResult,
      recentSubmissionsResult,
    ] = await Promise.all([
      // Total pages
      db
        .select({ count: sql<number>`count(*)::int` })
        .from(pages)
        .where(eq(pages.tenantId, tenantId))
        .then((r) => r[0]?.count ?? 0),

      // Total posts
      db
        .select({ count: sql<number>`count(*)::int` })
        .from(posts)
        .where(eq(posts.tenantId, tenantId))
        .then((r) => r[0]?.count ?? 0),

      // Active banners (display_start <= now <= display_end, or no date constraints)
      db
        .select({ count: sql<number>`count(*)::int` })
        .from(banners)
        .where(
          and(
            eq(banners.tenantId, tenantId),
            sql`(${banners.displayStart} IS NULL OR ${banners.displayStart} <= ${now})`,
            sql`(${banners.displayEnd} IS NULL OR ${banners.displayEnd} >= ${now})`,
          ),
        )
        .then((r) => r[0]?.count ?? 0),

      // New (unprocessed) contact submissions
      db
        .select({ count: sql<number>`count(*)::int` })
        .from(contactFormSubmissions)
        .where(
          and(
            eq(contactFormSubmissions.tenantId, tenantId),
            eq(contactFormSubmissions.processed, false),
          ),
        )
        .then((r) => r[0]?.count ?? 0),

      // Scheduled posts (published_at in the future)
      db
        .select({
          id: posts.id,
          slug: posts.slug,
          publishedAt: posts.publishedAt,
          title: postTranslations.title,
        })
        .from(posts)
        .leftJoin(
          postTranslations,
          and(
            eq(postTranslations.postId, posts.id),
            eq(postTranslations.languageCode, 'pt-BR'),
          ),
        )
        .where(
          and(
            eq(posts.tenantId, tenantId),
            eq(posts.status, 'draft'),
            gte(posts.publishedAt, now),
          ),
        )
        .orderBy(posts.publishedAt)
        .limit(10),

      // Posts published per month (last 6 months)
      (() => {
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        sixMonthsAgo.setDate(1);
        sixMonthsAgo.setHours(0, 0, 0, 0);

        return db
          .select({
            month: sql<string>`to_char(${posts.publishedAt}, 'YYYY-MM')`,
            count: sql<number>`count(*)::int`,
          })
          .from(posts)
          .where(
            and(
              eq(posts.tenantId, tenantId),
              eq(posts.status, 'published'),
              gte(posts.publishedAt, sixMonthsAgo),
            ),
          )
          .groupBy(sql`to_char(${posts.publishedAt}, 'YYYY-MM')`)
          .orderBy(sql`to_char(${posts.publishedAt}, 'YYYY-MM')`);
      })(),

      // Recent contact submissions (last 5)
      db
        .select({
          id: contactFormSubmissions.id,
          name: contactFormSubmissions.name,
          email: contactFormSubmissions.email,
          subject: contactFormSubmissions.subject,
          submittedAt: contactFormSubmissions.submittedAt,
        })
        .from(contactFormSubmissions)
        .where(eq(contactFormSubmissions.tenantId, tenantId))
        .orderBy(sql`${contactFormSubmissions.submittedAt} DESC`)
        .limit(5),
    ]);

    return {
      data: {
        totalPages: pagesCount,
        totalPosts: postsCount,
        activeBanners: activeBannersCount,
        newSubmissions: newSubmissionsCount,
        scheduledPosts: scheduledPostsResult.map((p) => ({
          id: p.id,
          slug: p.slug,
          title: p.title ?? null,
          publishedAt: p.publishedAt?.toISOString() ?? null,
        })),
        postsPerMonth: postsPerMonthResult.map((r) => ({
          month: r.month,
          count: r.count,
        })),
        recentSubmissions: recentSubmissionsResult.map((s) => ({
          id: s.id,
          name: s.name,
          email: s.email,
          subject: s.subject ?? null,
          submittedAt: s.submittedAt.toISOString(),
        })),
      },
    };
  }
}
