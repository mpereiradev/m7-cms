"use client";

import {
  FileText,
  Newspaper,
  RectangleHorizontal,
  MessageSquare,
} from "lucide-react";
import { useDashboardStats } from "@/lib/hooks/use-dashboard";
import { StatsCard } from "@/components/dashboard/stats-card";
import { ActivityChart } from "@/components/dashboard/activity-chart";
import { ScheduledPostsList } from "@/components/dashboard/scheduled-posts-list";
import { RecentSubmissionsList } from "@/components/dashboard/recent-submissions-list";
import { QuickActions } from "@/components/dashboard/quick-actions";

export function DashboardClient() {
  const { data, isLoading } = useDashboardStats();
  const stats = data?.data;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Visao geral do seu site
        </p>
      </div>

      {/* Top row: 4 stats cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total de Paginas"
          value={stats?.totalPages}
          icon={FileText}
          isLoading={isLoading}
        />
        <StatsCard
          title="Total de Posts"
          value={stats?.totalPosts}
          icon={Newspaper}
          isLoading={isLoading}
        />
        <StatsCard
          title="Banners Ativos"
          value={stats?.activeBanners}
          icon={RectangleHorizontal}
          isLoading={isLoading}
        />
        <StatsCard
          title="Novas Mensagens"
          value={stats?.newSubmissions}
          icon={MessageSquare}
          isLoading={isLoading}
        />
      </div>

      {/* Middle: Activity chart */}
      <ActivityChart data={stats?.postsPerMonth} isLoading={isLoading} />

      {/* Bottom row: Scheduled Posts + Recent Submissions + Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <ScheduledPostsList
          posts={stats?.scheduledPosts}
          isLoading={isLoading}
        />
        <RecentSubmissionsList
          submissions={stats?.recentSubmissions}
          isLoading={isLoading}
        />
        <QuickActions />
      </div>
    </div>
  );
}
