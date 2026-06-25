"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, ImagePlus, X } from "lucide-react";
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
import { SlugField } from "@/components/shared/slug-field";
import { MediaPicker } from "@/components/media/media-picker";
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
  defaultCoverUrl?: string | null;
};

function getTranslation(post: Post | undefined, lang: string) {
  if (!post) return undefined;
  return post.translations.find((t) => t.languageCode === lang);
}

export function PostForm({ post, defaultCoverUrl }: PostFormProps) {
  const router = useRouter();
  const createPost = useCreatePost();
  const updatePost = useUpdatePost();
  const { data: categoriesData } = useCategories();
  const { data: tagsData } = useTags();
  const isEditing = !!post;

  const [pickerOpen, setPickerOpen] = useState(false);
  const [coverUrl, setCoverUrl] = useState<string | null>(defaultCoverUrl ?? null);
  const [coverName, setCoverName] = useState<string | null>(null);

  const ptBr = getTranslation(post, "pt-BR");
  const en = getTranslation(post, "en");

  const form = useForm<PostFormValues>({
    resolver: zodResolver(postFormSchema),
    defaultValues: {
      slug: post?.slug ?? "",
      status: post?.status ?? "draft",
      publishedAt: post?.publishedAt ?? "",
      coverMediaId: post?.coverMediaId ?? "",
      coverImageUrl: "",
      categoryIds: post?.categoryIds ?? [],
      tagIds: post?.tagIds ?? [],
      translations: {
        "pt-BR": {
          languageCode: "pt-BR",
          title: ptBr?.title ?? "",
          summary: ptBr?.summary ?? "",
          seoTitle: ptBr?.seoTitle ?? "",
          seoDescription: ptBr?.seoDescription ?? "",
        },
        en: {
          languageCode: "en",
          title: en?.title ?? "",
          summary: en?.summary ?? "",
          seoTitle: en?.seoTitle ?? "",
          seoDescription: en?.seoDescription ?? "",
        },
      },
    },
  });

  async function onSubmit(values: PostFormValues) {
    const translations = Object.values(values.translations).filter(
      (t) => t.title
    );

    const payload: Record<string, unknown> = {
      slug: values.slug,
      status: values.status,
      categoryIds: values.categoryIds,
      tagIds: values.tagIds,
      translations,
    };

    if (values.publishedAt) payload.publishedAt = values.publishedAt;
    if (values.coverMediaId) payload.coverMediaId = values.coverMediaId;
    if (values.coverImageUrl) payload.coverImageUrl = values.coverImageUrl;

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
  const categories = categoriesData ?? [];
  const tags = tagsData ?? [];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-3">
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="draft">Rascunho</SelectItem>
                    <SelectItem value="published">Publicado</SelectItem>
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
                <FormMessage />
              </FormItem>
            )}
              />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Imagem de capa</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="coverMediaId"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div>
                      {coverUrl ? (
                        <div className="relative rounded-lg border overflow-hidden">
                          <img
                            src={coverUrl}
                            alt="Capa"
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
                                  setCoverUrl(null);
                                  setCoverName(null);
                                }}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          {coverName && (
                            <div className="px-3 py-2 bg-muted text-xs text-muted-foreground truncate">
                              {coverName}
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
                            Selecionar imagem de capa
                          </span>
                          <span className="text-xs">
                            Da biblioteca ou envie uma nova
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

            <FormField
              control={form.control}
              name="coverImageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ou use um link externo</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://exemplo.com/imagem.jpg"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        if (e.target.value) {
                          form.setValue("coverMediaId", "");
                          setCoverUrl(null);
                          setCoverName(null);
                        }
                      }}
                    />
                  </FormControl>
                  <FormDescription>
                    Se preferir, cole a URL de uma imagem externa
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Conteudo</CardTitle>
          </CardHeader>
          <CardContent>
            <LangTabs>
              {(lang) => (
                <div className="space-y-4 pt-4">
                  <div className="space-y-1.5">
                    <FormField
                      control={form.control}
                      name={`translations.${lang}.title`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                          Titulo {lang === "en" ? "(English)" : "(Portugues)"} {lang === "pt-BR" && "*"}
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Titulo do post" {...field} />
                        </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {lang === "pt-BR" && (
                      <SlugField form={form} sourceField="translations.pt-BR.title" />
                    )}
                  </div>

                  <FormField
                    control={form.control}
                    name={`translations.${lang}.summary`}
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
                    name={`translations.${lang}.seoTitle`}
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
                    name={`translations.${lang}.seoDescription`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Meta Description (SEO)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Descricao para mecanismos de busca"
                            rows={2}
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
              <CardTitle>Categorias</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-48 overflow-y-auto rounded-md border p-3">
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
                                    field.onChange([...(field.value ?? []), cat.id]);
                                  } else {
                                    field.onChange(
                                      field.value?.filter((v: string) => v !== cat.id)
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
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tags</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-48 overflow-y-auto rounded-md border p-3">
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
                                  field.onChange([...(field.value ?? []), tag.id]);
                                } else {
                                  field.onChange(
                                    field.value?.filter((v: string) => v !== tag.id)
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

      <MediaPicker
        open={pickerOpen}
        onOpenChange={setPickerOpen}
        onSelect={(result) => {
          form.setValue("coverMediaId", result.id, { shouldValidate: true });
          form.setValue("coverImageUrl", "");
          setCoverUrl(result.url);
          setCoverName(result.filename);
        }}
        accept="image/*"
        title="Selecionar imagem de capa"
      />
    </Form>
  );
}
