"use client";

import { useState } from "react";
import { Mail, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useSubmissions } from "@/lib/hooks/use-submissions";
import { SubmissionDetail } from "@/components/contact/submission-detail";
import type { Submission, SubmissionStatus } from "@/lib/api/submissions.api";

export function SubmissionsListClient() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<SubmissionStatus | "all">("all");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Submission | null>(null);

  const { data, isLoading } = useSubmissions({
    page,
    perPage: 20,
    status: status === "all" ? undefined : status,
    search,
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  const submissions = data?.data ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.ceil(total / 20);

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">
          Formularios de Contato
        </h1>
        <p className="text-muted-foreground">
          Visualize e gerencie as mensagens recebidas pelo formulario de contato.
        </p>
      </div>

      <div className="flex items-center gap-4 mb-4">
        <Input
          placeholder="Buscar por nome ou assunto..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="max-w-sm"
        />
        <Select
          value={status}
          onValueChange={(val) => {
            setStatus(val as SubmissionStatus | "all");
            setPage(1);
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filtrar status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            <SelectItem value="new">Novas</SelectItem>
            <SelectItem value="processed">Processadas</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Status</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>E-mail</TableHead>
              <TableHead>Assunto</TableHead>
              <TableHead>Data</TableHead>
              <TableHead className="w-[80px]">Acoes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {submissions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  <div className="flex flex-col items-center gap-2">
                    <Mail className="h-8 w-8 text-muted-foreground" />
                    <p>Nenhuma mensagem encontrada</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              submissions.map((submission) => (
                <TableRow
                  key={submission.id}
                  className="cursor-pointer"
                  onClick={() => setSelected(submission)}
                >
                  <TableCell>
                    <Badge
                      variant={
                        submission.status === "new" ? "default" : "secondary"
                      }
                    >
                      {submission.status === "new" ? "Nova" : "Processada"}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">
                    {submission.name}
                  </TableCell>
                  <TableCell>{submission.email}</TableCell>
                  <TableCell>
                    {submission.subject || (
                      <span className="text-muted-foreground">--</span>
                    )}
                  </TableCell>
                  <TableCell>{formatDate(submission.createdAt)}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelected(submission);
                      }}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Anterior
          </Button>
          <span className="text-sm text-muted-foreground">
            Pagina {page} de {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Proxima
          </Button>
        </div>
      )}

      <SubmissionDetail
        submission={selected}
        open={!!selected}
        onOpenChange={(open) => {
          if (!open) setSelected(null);
        }}
      />
    </>
  );
}
