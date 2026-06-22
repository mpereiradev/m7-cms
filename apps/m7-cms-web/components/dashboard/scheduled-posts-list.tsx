"use client";

import Link from "next/link";
import { Calendar, ExternalLink } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

type ScheduledPost = {
  id: string;
  slug: string;
  title: string | null;
  publishedAt: string | null;
};

type ScheduledPostsListProps = {
  posts: ScheduledPost[] | undefined;
  isLoading?: boolean;
};

function formatDate(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function ScheduledPostsList({ posts, isLoading }: ScheduledPostsListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          Posts Agendados
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : !posts || posts.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Nenhum post agendado
          </p>
        ) : (
          <ul className="space-y-3">
            {posts.map((post) => (
              <li key={post.id}>
                <Link
                  href={`/posts/${post.id}`}
                  className="flex items-center justify-between rounded-md border p-3 transition-colors hover:bg-muted/50"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">
                      {post.title ?? post.slug}
                    </p>
                    {post.publishedAt && (
                      <p className="text-xs text-muted-foreground">
                        {formatDate(post.publishedAt)}
                      </p>
                    )}
                  </div>
                  <ExternalLink className="ml-2 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
