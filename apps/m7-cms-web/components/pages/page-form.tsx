"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import {
  pageFormSchema,
  type PageFormValues,
  type Page,
} from "@/lib/schemas/page.schema";
import { useCreatePage, useUpdatePage } from "@/lib/hooks/use-pages";
import { LangTabs } from "@/components/shared/lang-tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type PageFormProps = {
  page?: Page;
};

function getTranslation(page: Page | undefined, lang: string) {
  if (!page) return undefined;
  return page.translations.find((t) => t.languageCode === lang);
}

export function PageForm({ page }: PageFormProps) {
  const router = useRouter();
  const createPage = useCreatePage();
  const updatePage = useUpdatePage();
  const isEditing = !!page;

  const ptBr = getTranslation(page, "pt-BR");
  const en = getTranslation(page, "en");

  const form = useForm<PageFormValues>({
    resolver: zodResolver(pageFormSchema),
    defaultValues: {
      isPublished: page?.isPublished ?? false,
      publishedAt: page?.publishedAt ?? "",
      translations: {
        "pt-BR": {
          languageCode: "pt-BR",
          title: ptBr?.title ?? "",
          slug: ptBr?.slug ?? "",
          metaTitle: ptBr?.metaTitle ?? "",
          metaDescription: ptBr?.metaDescription ?? "",
        },
        en: {
          languageCode: "en",
          title: en?.title ?? "",
          slug: en?.slug ?? "",
          metaTitle: en?.metaTitle ?? "",
          metaDescription: en?.metaDescription ?? "",
        },
      },
    },
  });

  async function onSubmit(values: PageFormValues) {
    const translations = Object.values(values.translations).filter(
      (t) => t.title && t.slug
    );

    const payload = {
      isPublished: values.isPublished,
      publishedAt: values.publishedAt || null,
      translations,
    };

    try {
      if (isEditing) {
        await updatePage.mutateAsync({ id: page.id, data: payload });
        toast.success("Pagina atualizada com sucesso!");
      } else {
        await createPage.mutateAsync(payload);
        toast.success("Pagina criada com sucesso!");
      }
      router.push("/pages");
    } catch (error) {
      toast.error(
        isEditing ? "Erro ao atualizar pagina" : "Erro ao criar pagina",
        {
          description:
            error instanceof Error ? error.message : "Erro desconhecido",
        }
      );
    }
  }

  const isPending = createPage.isPending || updatePage.isPending;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Conteudo</CardTitle>
          </CardHeader>
          <CardContent>
            <LangTabs>
              {(lang) => (
                <div className="space-y-4 pt-4">
                  <FormField
                    control={form.control}
                    name={`translations.${lang}.title`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Titulo {lang === "en" ? "(English)" : "(Portugues)"}
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Titulo da pagina" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`translations.${lang}.slug`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Slug</FormLabel>
                        <FormControl>
                          <Input placeholder="titulo-da-pagina" {...field} />
                        </FormControl>
                        <FormDescription>
                          URL amigavel. Ex: /paginas/titulo-da-pagina
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`translations.${lang}.metaTitle`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Meta Title (SEO)</FormLabel>
                        <FormControl>
                          <Input placeholder="Titulo para SEO" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`translations.${lang}.metaDescription`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Meta Description (SEO)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Descricao para mecanismos de busca"
                            rows={3}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
            </LangTabs>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Publicacao</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="isPublished"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Publicar pagina</FormLabel>
                    <FormDescription>
                      Marque para tornar a pagina visivel no site
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="publishedAt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data de publicacao</FormLabel>
                  <FormControl>
                    <Input type="datetime-local" {...field} />
                  </FormControl>
                  <FormDescription>
                    Deixe vazio para publicar imediatamente
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <div className="flex items-center gap-4">
          <Button type="submit" disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEditing ? "Salvar alteracoes" : "Criar pagina"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/pages")}
          >
            Cancelar
          </Button>
        </div>
      </form>
    </Form>
  );
}
