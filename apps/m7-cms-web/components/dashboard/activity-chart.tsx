"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type ActivityChartProps = {
  data: { month: string; count: number }[] | undefined;
  isLoading?: boolean;
};

function formatMonth(yyyyMM: string): string {
  const [year, month] = yyyyMM.split("-");
  const monthNames = [
    "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
    "Jul", "Ago", "Set", "Out", "Nov", "Dez",
  ];
  const idx = parseInt(month, 10) - 1;
  return `${monthNames[idx]} ${year}`;
}

export function ActivityChart({ data, isLoading }: ActivityChartProps) {
  const chartData = (data ?? []).map((item) => ({
    month: formatMonth(item.month),
    posts: item.count,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Posts Publicados</CardTitle>
        <CardDescription>Publicacoes por mes nos ultimos 6 meses</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-[300px] w-full" />
        ) : chartData.length === 0 ? (
          <div className="flex h-[300px] items-center justify-center text-muted-foreground">
            Nenhum post publicado nos ultimos 6 meses
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="month"
                className="text-xs"
                tick={{ fill: "hsl(var(--muted-foreground))" }}
              />
              <YAxis
                allowDecimals={false}
                className="text-xs"
                tick={{ fill: "hsl(var(--muted-foreground))" }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--popover))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  color: "hsl(var(--popover-foreground))",
                }}
              />
              <Bar
                dataKey="posts"
                fill="hsl(var(--primary))"
                radius={[4, 4, 0, 0]}
                name="Posts"
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
