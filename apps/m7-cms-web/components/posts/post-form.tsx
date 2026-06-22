"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import {
  postFormSchema,
  type PostFormValues,
  type Post,
} from "@/lib/schemas/post.schema";
import { useCreatePost, useUpdatePost } from "@/lib/hooks/use-posts";
import { useCategories } from "@/lib/hooks/use-categories";
import { useTags } from "@/lib/hooks/use-tags";
import { LangTabs } from "@/components/shared/lang-tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

type PostFormProps = {
  post?: Post;
};

function getTranslation(post: Post | undefined, lang: string) {
  if (!post) return undefined;
  return post.translations.find((t) => t.languageCode === lang);
}

export function PostForm({ post }: PostFormProps) {
  const router = useRouter();
  const createPost = useCreatePost();
  const updatePost = useUpdatePost();
  const { data: categoriesData } = useCategories({ perPage: 100 });
  const { data: tagsData } = useTags({ perPage: 100 });
  const isEditing = !!post;

  const ptBr = getTranslation(post, "pt-BR");
  const en = getTranslation(post, "en");

  const form = useForm<PostFormValues>({
    resolver: zodResolver(postFormSchema),
    defaultValues: {
      status: post?.status ?? "draft",
      publishedAt: post?.publishedAt ?? "",
      coverImageUrl: post?.coverImageUrl ?? "",
      categoryIds: post?.categories?.map((c) => c.id) ?? [],
      tagIds: post?.tags?.map((t) => t.id) ?? [],
      body: post?.body ?? undefined,
      translations: {
        "pt-BR": {
          languageCode: "pt-BR",
          title: ptBr?.title ?? "",
          slug: ptBr?.slug ?? "",
          excerpt: ptBr?.excerpt ?? "",
          metaTitle: ptBr?.metaTitle ?? "",
          metaDescription: ptBr?.metaDescription ?? "",
        },
        en: {
          languageCode: "en",
          title: en?.title ?? "",
          slug: en?.slug ?? "",
          excerpt: en?.excerpt ?? "",
          metaTitle: en?.metaTitle ?? "",
          metaDescription: en?.metaDescription ?? "",
        },
      },
    },
  });

  async function onSubmit(values: PostFormValues) {
    const translations = Object.values(values.translations).filter(
      (t) => t.title && t.slug
    );

    const payload = {
      status: values.status,
      publishedAt: values.publishedAt || null,
      coverImageUrl: values.coverImageUrl || null,
      categoryIds: values.categoryIds,
      tagIds: values.tagIds,
      body: values.body ?? null,
      translations,
    };

    try {
      if (isEditing) {
        await updatePost.mutateAsync({ id: post.id, data: payload });
        toast.success("Post atualizado com sucesso!");
      } else {
        await createPost.mutateAsync(payload);
        toast.success("Post criado com sucesso!");
      }
      router.push("/posts");
    } catch (error) {
      toast.error(
        isEditing ? "Erro ao atualizar post" : "Erro ao criar post",
        {
          description:
            error instanceof Error ? error.message : "Erro desconhecido",
        }
      );
    }
  }

  const isPending = createPost.isPending || updatePost.isPending;

  const categories = categoriesData?.data ?? [];
  const tags = tagsData?.data ?? [];

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
                          <Input placeholder="Titulo do post" {...field} />
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
                          <Input placeholder="titulo-do-post" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`translations.${lang}.excerpt`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Resumo</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Breve resumo do post"
                            rows={3}
                            {...field}
                          />
                        </FormControl>
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

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Publicacao</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="draft">Rascunho</SelectItem>
                        <SelectItem value="published">Publicado</SelectItem>
                        <SelectItem value="scheduled">Agendado</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
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
                      Obrigatoria para posts agendados
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="coverImageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL da imagem de capa</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Classificacao</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <FormLabel className="mb-2 block">Categorias</FormLabel>
                <div className="space-y-2 max-h-40 overflow-y-auto rounded-md border p-3">
                  {categories.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      Nenhuma categoria encontrada
                    </p>
                  ) : (
                    categories.map((cat) => {
                      const catName =
                        cat.translations.find((t) => t.languageCode === "pt-BR")
                          ?.name ??
                        cat.translations[0]?.name ??
                        "Sem nome";
                      return (
                        <FormField
                          key={cat.id}
                          control={form.control}
                          name="categoryIds"
                          render={({ field }) => (
                            <FormItem className="flex items-center space-x-2 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(cat.id)}
                                  onCheckedChange={(checked) => {
                                    if (checked) {
                                      field.onChange([
                                        ...(field.value ?? []),
                                        cat.id,
                                      ]);
                                    } else {
                                      field.onChange(
                                        field.value?.filter(
                                          (v: string) => v !== cat.id
                                        )
                                      );
                                    }
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="text-sm font-normal cursor-pointer">
                                {catName}
                              </FormLabel>
                            </FormItem>
                          )}
                        />
                      );
                    })
                  )}
                </div>
              </div>

              <div>
                <FormLabel className="mb-2 block">Tags</FormLabel>
                <div className="space-y-2 max-h-40 overflow-y-auto rounded-md border p-3">
                  {tags.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      Nenhuma tag encontrada
                    </p>
                  ) : (
                    tags.map((tag) => (
                      <FormField
                        key={tag.id}
                        control={form.control}
                        name="tagIds"
                        render={({ field }) => (
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(tag.id)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    field.onChange([
                                      ...(field.value ?? []),
                                      tag.id,
                                    ]);
                                  } else {
                                    field.onChange(
                                      field.value?.filter(
                                        (v: string) => v !== tag.id
                                      )
                                    );
                                  }
                                }}
                              />
                            </FormControl>
                            <FormLabel className="text-sm font-normal cursor-pointer">
                              {tag.name}
                            </FormLabel>
                          </FormItem>
                        )}
                      />
                    ))
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex items-center gap-4">
          <Button type="submit" disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEditing ? "Salvar alteracoes" : "Criar post"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/posts")}
          >
            Cancelar
          </Button>
        </div>
      </form>
    </Form>
  );
}
