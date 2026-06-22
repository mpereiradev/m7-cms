import { apiRequest } from "@/lib/api/client";

export type DashboardStats = {
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

export async function getDashboardStats(): Promise<{ data: DashboardStats }> {
  return apiRequest<{ data: DashboardStats }>("/dashboard/stats");
}
