"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, ImagePlus, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MediaPicker } from "@/components/media/media-picker";
import { bannerSchema, type BannerFormValues } from "@/lib/schemas/banner.schema";

type BannerFormProps = {
  onSubmit: (data: BannerFormValues) => void;
  defaultValues?: Partial<BannerFormValues>;
  defaultMediaUrl?: string | null;
  isLoading?: boolean;
  mode?: "create" | "edit";
};

export function BannerForm({
  onSubmit,
  defaultValues,
  defaultMediaUrl,
  isLoading = false,
  mode = "create",
}: BannerFormProps) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const [selectedMediaUrl, setSelectedMediaUrl] = useState<string | null>(
    defaultMediaUrl ?? null
  );
  const [selectedMediaName, setSelectedMediaName] = useState<string | null>(null);

  const nowLocal = new Date();
  nowLocal.setMinutes(nowLocal.getMinutes() - nowLocal.getTimezoneOffset());
  const nowIso = nowLocal.toISOString().slice(0, 16);

  const form = useForm<BannerFormValues>({
    resolver: zodResolver(bannerSchema),
    defaultValues: {
      title: "",
      mediaId: "",
      ctaLabel: "",
      linkUrl: "",
      displayStart: nowIso,
      displayEnd: "",
      order: 0,
      ...defaultValues,
    },
  });

  useEffect(() => {
    if (defaultValues) {
      form.reset({
        title: "",
        mediaId: "",
        ctaLabel: "",
        linkUrl: "",
        displayStart: nowIso,
        displayEnd: "",
        order: 0,
        ...defaultValues,
      });
    }
    if (defaultMediaUrl) {
      setSelectedMediaUrl(defaultMediaUrl);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValues, defaultMediaUrl]);

  const watchedValues = form.watch();

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
      <Form {...form}>
        <form onSubmit={form.handleSubmit((values) => {
          onSubmit({
            ...values,
            displayEnd: values.displayEnd || undefined as unknown as string,
          });
        })} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informacoes do banner</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Titulo *</FormLabel>
                    <FormControl>
                      <Input placeholder="Titulo do banner" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="mediaId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Imagem do banner</FormLabel>
                    <FormControl>
                      <div>
                        {selectedMediaUrl ? (
                          <div className="relative rounded-lg border overflow-hidden">
                            <img
                              src={selectedMediaUrl}
                              alt="Banner selecionado"
                              className="w-full h-48 object-cover"
                            />
                            <div className="absolute inset-0 bg-black/0 hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 hover:opacity-100">
                              <div className="flex gap-2">
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="secondary"
                                  onClick={() => setPickerOpen(true)}
                                >
                                  Trocar
                                </Button>
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => {
                                    field.onChange("");
                                    setSelectedMediaUrl(null);
                                    setSelectedMediaName(null);
                                  }}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                            {selectedMediaName && (
                              <div className="px-3 py-2 bg-muted text-xs text-muted-foreground truncate">
                                {selectedMediaName}
                              </div>
                            )}
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setPickerOpen(true)}
                            className="flex w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-muted-foreground/25 p-8 text-muted-foreground transition-colors hover:border-primary/50 hover:bg-muted/50"
                          >
                            <ImagePlus className="h-10 w-10" />
                            <span className="text-sm font-medium">
                              Selecionar imagem
                            </span>
                            <span className="text-xs">
                              Escolha da biblioteca ou envie uma nova
                            </span>
                          </button>
                        )}
                        <input type="hidden" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Chamada para acao (CTA)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="ctaLabel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Texto do botao</FormLabel>
                    <FormControl>
                      <Input placeholder="Saiba mais" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="linkUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Link do botao</FormLabel>
                    <FormControl>
                      <Input placeholder="https://..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Exibicao e agendamento</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="order"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ordem de exibicao</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="displayStart"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data de inicio *</FormLabel>
                      <FormControl>
                        <Input type="datetime-local" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="displayEnd"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data de termino</FormLabel>
                      <FormControl>
                        <Input type="datetime-local" {...field} />
                      </FormControl>
                      <FormDescription>
                        Opcional. Deixe vazio para exibir por tempo indeterminado.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-2">
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="animate-spin" />}
              {mode === "create" ? "Criar banner" : "Salvar alteracoes"}
            </Button>
          </div>
        </form>
      </Form>

      <div className="space-y-4">
        <h3 className="text-sm font-medium text-muted-foreground">
          Pre-visualizacao
        </h3>
        <div className="sticky top-6">
          <Card className="overflow-hidden">
            <div className="relative aspect-[21/9] bg-muted">
              {selectedMediaUrl ? (
                <img
                  src={selectedMediaUrl}
                  alt={watchedValues.title || "Banner"}
                  className="object-cover w-full h-full"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                  Sem imagem
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                <h3 className="text-lg font-semibold line-clamp-2">
                  {watchedValues.title || "Titulo do banner"}
                </h3>
                {watchedValues.ctaLabel && (
                  <div className="mt-2">
                    <span className="inline-flex items-center gap-1 rounded bg-white/20 px-3 py-1 text-sm font-medium backdrop-blur-sm">
                      {watchedValues.ctaLabel}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>
      </div>

      <MediaPicker
        open={pickerOpen}
        onOpenChange={setPickerOpen}
        onSelect={(result) => {
          form.setValue("mediaId", result.id, { shouldValidate: true });
          setSelectedMediaUrl(result.url);
          setSelectedMediaName(result.filename);
        }}
        accept="image/*"
        title="Selecionar imagem do banner"
      />
    </div>
  );
}
