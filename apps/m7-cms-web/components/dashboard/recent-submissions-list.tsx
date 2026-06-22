"use client";

import Link from "next/link";
import { MessageSquare, ExternalLink } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

type RecentSubmission = {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  submittedAt: string;
};

type RecentSubmissionsListProps = {
  submissions: RecentSubmission[] | undefined;
  isLoading?: boolean;
};

function timeAgo(iso: string): string {
  const now = new Date();
  const date = new Date(iso);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60_000);

  if (diffMins < 1) return "agora mesmo";
  if (diffMins < 60) return `${diffMins}min atras`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h atras`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 30) return `${diffDays}d atras`;
  return date.toLocaleDateString("pt-BR");
}

export function RecentSubmissionsList({
  submissions,
  isLoading,
}: RecentSubmissionsListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4" />
          Ultimas Mensagens
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-14 w-full" />
            ))}
          </div>
        ) : !submissions || submissions.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Nenhuma mensagem recebida
          </p>
        ) : (
          <ul className="space-y-3">
            {submissions.map((sub) => (
              <li key={sub.id}>
                <Link
                  href={`/contact-submissions`}
                  className="flex items-center justify-between rounded-md border p-3 transition-colors hover:bg-muted/50"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-sm font-medium">{sub.name}</p>
                      <span className="text-xs text-muted-foreground">
                        {timeAgo(sub.submittedAt)}
                      </span>
                    </div>
                    <p className="truncate text-xs text-muted-foreground">
                      {sub.subject ?? sub.email}
                    </p>
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
