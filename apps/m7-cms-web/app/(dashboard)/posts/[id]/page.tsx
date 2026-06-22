"use client";

import { use } from "react";
import { usePost } from "@/lib/hooks/use-posts";
import { PostForm } from "@/components/posts/post-form";
import { Skeleton } from "@/components/ui/skeleton";

export default function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data, isLoading, error } = usePost(id);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-md border border-destructive/50 bg-destructive/10 p-4 text-destructive">
        Erro ao carregar post: {error.message}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Editar post</h1>
        <p className="text-muted-foreground">
          Atualize os dados do post
        </p>
      </div>
      <PostForm post={data?.data} />
    </div>
  );
}
