"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useMarkProcessed } from "@/lib/hooks/use-submissions";
import type { Submission } from "@/lib/api/submissions.api";

type SubmissionDetailProps = {
  submission: Submission | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function SubmissionDetail({
  submission,
  open,
  onOpenChange,
}: SubmissionDetailProps) {
  const markProcessed = useMarkProcessed();

  if (!submission) return null;

  async function handleMarkProcessed() {
    if (!submission) return;
    await markProcessed.mutateAsync(submission.id);
    onOpenChange(false);
  }

  const formattedDate = new Date(submission.createdAt).toLocaleDateString(
    "pt-BR",
    {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
  );

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Detalhes da Mensagem</SheetTitle>
          <SheetDescription>
            Recebida em {formattedDate}
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-4 mt-6">
          <div className="flex items-center gap-2">
            <Badge
              variant={submission.status === "new" ? "default" : "secondary"}
            >
              {submission.status === "new" ? "Nova" : "Processada"}
            </Badge>
          </div>

          <Separator />

          <div className="space-y-3">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Nome</p>
              <p className="text-sm">{submission.name}</p>
            </div>

            <div>
              <p className="text-sm font-medium text-muted-foreground">
                E-mail
              </p>
              <p className="text-sm">
                <a
                  href={`mailto:${submission.email}`}
                  className="text-primary underline"
                >
                  {submission.email}
                </a>
              </p>
            </div>

            {submission.subject && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Assunto
                </p>
                <p className="text-sm">{submission.subject}</p>
              </div>
            )}

            <Separator />

            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                Mensagem
              </p>
              <p className="text-sm whitespace-pre-wrap leading-relaxed">
                {submission.message}
              </p>
            </div>
          </div>

          {submission.status === "new" && (
            <div className="pt-4">
              <Button
                onClick={handleMarkProcessed}
                disabled={markProcessed.isPending}
                className="w-full"
              >
                {markProcessed.isPending
                  ? "Processando..."
                  : "Marcar como Processada"}
              </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
