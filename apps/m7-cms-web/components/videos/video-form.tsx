"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useCreateVideo, useUpdateVideo, useVideo } from "@/lib/hooks/use-videos";

const videoSchema = z.object({
  title: z.string().min(1, "Titulo e obrigatorio"),
  url: z.string().url("Deve ser uma URL valida"),
  description: z.string().optional(),
  thumbnailUrl: z.string().url("Deve ser uma URL valida").optional().or(z.literal("")),
});

type VideoFormValues = z.infer<typeof videoSchema>;

type VideoFormProps = {
  galleryId: string;
  videoId?: string;
  backPath: string;
};

function detectProvider(url: string): "youtube" | "vimeo" | "local" | "other" {
  try {
    const parsed = new URL(url);
    const hostname = parsed.hostname.toLowerCase();

    if (
      hostname.includes("youtube.com") ||
      hostname.includes("youtu.be")
    ) {
      return "youtube";
    }
    if (hostname.includes("vimeo.com")) {
      return "vimeo";
    }
    if (
      url.match(/\.(mp4|webm|ogg|mov)$/i)
    ) {
      return "local";
    }
    return "other";
  } catch {
    return "other";
  }
}

function getYoutubeThumbnail(url: string): string | null {
  try {
    const parsed = new URL(url);
    let videoId: string | null = null;

    if (parsed.hostname.includes("youtube.com")) {
      videoId = parsed.searchParams.get("v");
    } else if (parsed.hostname.includes("youtu.be")) {
      videoId = parsed.pathname.slice(1);
    }

    if (videoId) {
      return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
    }
  } catch {
    // ignore
  }
  return null;
}

function getVimeoId(url: string): string | null {
  try {
    const match = url.match(/vimeo\.com\/(\d+)/);
    return match ? match[1] : null;
  } catch {
    return null;
  }
}

export function VideoForm({ galleryId, videoId, backPath }: VideoFormProps) {
  const router = useRouter();
  const isEditing = !!videoId;

  const { data: existingVideo, isLoading } = useVideo(videoId ?? "", !!videoId);
  const createMutation = useCreateVideo();
  const updateMutation = useUpdateVideo();

  const form = useForm<VideoFormValues>({
    resolver: zodResolver(videoSchema),
    defaultValues: {
      title: "",
      url: "",
      description: "",
      thumbnailUrl: "",
    },
  });

  // Populate form when editing
  useEffect(() => {
    if (existingVideo) {
      form.reset({
        title: existingVideo.title,
        url: existingVideo.url,
        description: existingVideo.description ?? "",
        thumbnailUrl: existingVideo.thumbnailUrl ?? "",
      });
    }
  }, [existingVideo, form]);

  const watchedUrl = form.watch("url");
  const detectedProvider = watchedUrl ? detectProvider(watchedUrl) : null;

  // Auto-detect thumbnail for YouTube
  const watchedThumbnail = form.watch("thumbnailUrl");
  useEffect(() => {
    if (watchedUrl && !watchedThumbnail) {
      const provider = detectProvider(watchedUrl);
      if (provider === "youtube") {
        const thumb = getYoutubeThumbnail(watchedUrl);
        if (thumb) {
          form.setValue("thumbnailUrl", thumb);
        }
      }
    }
  }, [watchedUrl, watchedThumbnail, form]);

  const onSubmit = async (values: VideoFormValues) => {
    try {
      if (isEditing && videoId) {
        await updateMutation.mutateAsync({
          id: videoId,
          data: {
            title: values.title,
            url: values.url,
            description: values.description || undefined,
            thumbnailUrl: values.thumbnailUrl || undefined,
            galleryId,
          },
        });
        toast.success("Video atualizado");
      } else {
        await createMutation.mutateAsync({
          title: values.title,
          url: values.url,
          description: values.description || undefined,
          thumbnailUrl: values.thumbnailUrl || undefined,
          galleryId,
        });
        toast.success("Video adicionado");
      }
      router.push(backPath);
    } catch {
      toast.error(isEditing ? "Falha ao atualizar video" : "Falha ao adicionar video");
    }
  };

  if (isEditing && isLoading) {
    return (
      <div className="py-8 text-center text-muted-foreground">Carregando...</div>
    );
  }

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">
          {isEditing ? "Editar Video" : "Adicionar Video"}
        </h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Detalhes do Video</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Titulo</Label>
            <Input
              id="title"
              {...form.register("title")}
              placeholder="Titulo do video"
            />
            {form.formState.errors.title && (
              <p className="text-sm text-destructive">
                {form.formState.errors.title.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="url">URL do Video</Label>
            <Input
              id="url"
              {...form.register("url")}
              placeholder="https://youtube.com/watch?v=... ou https://vimeo.com/..."
            />
            {form.formState.errors.url && (
              <p className="text-sm text-destructive">
                {form.formState.errors.url.message}
              </p>
            )}
            {detectedProvider && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">
                  Detectado:
                </span>
                <Badge variant="secondary">
                  {detectedProvider === "youtube"
                    ? "YouTube"
                    : detectedProvider === "vimeo"
                      ? "Vimeo"
                      : detectedProvider === "local"
                        ? "Arquivo local"
                        : "Externo"}
                </Badge>
                {detectedProvider === "vimeo" && getVimeoId(watchedUrl) && (
                  <span className="text-xs text-muted-foreground">
                    ID: {getVimeoId(watchedUrl)}
                  </span>
                )}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descricao</Label>
            <Textarea
              id="description"
              {...form.register("description")}
              placeholder="Descricao opcional..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="thumbnailUrl">URL da Miniatura</Label>
            <Input
              id="thumbnailUrl"
              {...form.register("thumbnailUrl")}
              placeholder="https://..."
            />
            {form.formState.errors.thumbnailUrl && (
              <p className="text-sm text-destructive">
                {form.formState.errors.thumbnailUrl.message}
              </p>
            )}
            {watchedThumbnail && (
              <div className="mt-2">
                <img
                  src={watchedThumbnail}
                  alt="Pre-visualizacao da miniatura"
                  className="h-24 w-auto rounded border object-cover"
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={isPending}>
          {isPending
            ? "Salvando..."
            : isEditing
              ? "Salvar Alteracoes"
              : "Adicionar Video"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push(backPath)}
        >
          Cancelar
        </Button>
      </div>
    </form>
  );
}
