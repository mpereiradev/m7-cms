"use client";

import { useQuery } from "@tanstack/react-query";
import { getDashboardStats } from "@/lib/api/dashboard.api";

export function useDashboardStats() {
  return useQuery({
    queryKey: ["dashboard", "stats"],
    queryFn: () => getDashboardStats(),
    refetchInterval: 60_000, // refresh every 60s
  });
}
