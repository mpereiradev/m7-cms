"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BannerPreview } from "@/components/banners/banner-preview";
import { bannerSchema, type BannerFormValues } from "@/lib/schemas/banner.schema";

type BannerFormProps = {
  onSubmit: (data: BannerFormValues) => void;
  defaultValues?: Partial<BannerFormValues>;
  isLoading?: boolean;
  mode?: "create" | "edit";
};

export function BannerForm({
  onSubmit,
  defaultValues,
  isLoading = false,
  mode = "create",
}: BannerFormProps) {
  const form = useForm<BannerFormValues>({
    resolver: zodResolver(bannerSchema),
    defaultValues: {
      title: "",
      imageUrl: "",
      ctaLabel: "",
      ctaUrl: "",
      pageTarget: "home",
      isActive: true,
      startsAt: "",
      endsAt: "",
      ...defaultValues,
    },
  });

  useEffect(() => {
    if (defaultValues) {
      form.reset({
        title: "",
        imageUrl: "",
        ctaLabel: "",
        ctaUrl: "",
        pageTarget: "home",
        isActive: true,
        startsAt: "",
        endsAt: "",
        ...defaultValues,
      });
    }
  }, [defaultValues, form]);

  const watchedValues = form.watch();

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
      {/* Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic info */}
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
                    <FormLabel>Titulo</FormLabel>
                    <FormControl>
                      <Input placeholder="Titulo do banner" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL da imagem</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://exemplo.com/imagem.jpg"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Cole a URL da imagem do banner. Proporcao recomendada:
                      21:9.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* CTA */}
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
                name="ctaUrl"
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

          {/* Scheduling */}
          <Card>
            <CardHeader>
              <CardTitle>Exibicao e agendamento</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="pageTarget"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pagina de exibicao</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a pagina" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="home">Pagina inicial</SelectItem>
                        <SelectItem value="all">Todas as paginas</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="startsAt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data de inicio</FormLabel>
                      <FormControl>
                        <Input type="datetime-local" {...field} />
                      </FormControl>
                      <FormDescription>
                        Deixe vazio para exibir imediatamente.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="endsAt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data de termino</FormLabel>
                      <FormControl>
                        <Input type="datetime-local" {...field} />
                      </FormControl>
                      <FormDescription>
                        Deixe vazio para exibir indefinidamente.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Banner ativo</FormLabel>
                      <FormDescription>
                        Desmarque para ocultar o banner do site.
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="animate-spin" />}
              {mode === "create" ? "Criar banner" : "Salvar alteracoes"}
            </Button>
          </div>
        </form>
      </Form>

      {/* Preview sidebar */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-muted-foreground">
          Pre-visualizacao
        </h3>
        <div className="sticky top-6">
          <BannerPreview
            banner={{
              title: watchedValues.title || "",
              imageUrl: watchedValues.imageUrl || "",
              ctaLabel: watchedValues.ctaLabel || null,
              ctaUrl: watchedValues.ctaUrl || null,
              isActive: watchedValues.isActive ?? true,
              startsAt: watchedValues.startsAt || null,
              endsAt: watchedValues.endsAt || null,
            }}
          />
        </div>
      </div>
    </div>
  );
}
