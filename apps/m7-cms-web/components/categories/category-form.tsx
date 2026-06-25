"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import {
  categoryFormSchema,
  type CategoryFormValues,
  type Category,
  getCategoryName,
  buildCategoryTree,
  flattenTree,
} from "@/lib/schemas/category.schema";
import {
  useCategories,
  useCreateCategory,
  useUpdateCategory,
} from "@/lib/hooks/use-categories";
import { LangTabs } from "@/components/shared/lang-tabs";
import { SlugField } from "@/components/shared/slug-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type CategoryFormProps = {
  category?: Category;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function CategoryForm({
  category,
  open,
  onOpenChange,
}: CategoryFormProps) {
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const { data: allCategories } = useCategories();
  const isEditing = !!category;

  const ptBr = category?.translations.find((t) => t.languageCode === "pt-BR");
  const en = category?.translations.find((t) => t.languageCode === "en");

  const tree = buildCategoryTree(allCategories ?? [], 3);
  const flatOptions = flattenTree(tree).filter(
    ({ node, depth }) => depth < 2 && node.id !== category?.id
  );

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      slug: category?.slug ?? "",
      parentId: category?.parentId ?? null,
      order: category?.order ?? 0,
      translations: {
        "pt-BR": {
          languageCode: "pt-BR",
          name: ptBr?.name ?? "",
          description: ptBr?.description ?? "",
        },
        en: {
          languageCode: "en",
          name: en?.name ?? "",
          description: en?.description ?? "",
        },
      },
    },
  });

  async function onSubmit(values: CategoryFormValues) {
    const translations = Object.values(values.translations).filter(
      (t) => t.name
    );

    const payload = {
      slug: values.slug,
      parentId: values.parentId || null,
      order: values.order,
      translations,
    };

    try {
      if (isEditing) {
        await updateCategory.mutateAsync({ id: category.id, data: payload });
        toast.success("Categoria atualizada com sucesso!");
      } else {
        await createCategory.mutateAsync(payload);
        toast.success("Categoria criada com sucesso!");
      }
      onOpenChange(false);
      form.reset();
    } catch (error) {
      toast.error(
        isEditing
          ? "Erro ao atualizar categoria"
          : "Erro ao criar categoria",
        {
          description:
            error instanceof Error ? error.message : "Erro desconhecido",
        }
      );
    }
  }

  const isPending = createCategory.isPending || updateCategory.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar categoria" : "Nova categoria"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <LangTabs>
              {(lang) => (
                <div className="space-y-4 pt-4">
                  <div className="space-y-1.5">
                    <FormField
                      control={form.control}
                      name={`translations.${lang}.name`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Nome {lang === "en" ? "(English)" : "(Portugues)"} {lang === "pt-BR" && "*"}
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="Nome da categoria" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {lang === "pt-BR" && (
                      <SlugField form={form} sourceField="translations.pt-BR.name" />
                    )}
                  </div>

                  <FormField
                    control={form.control}
                    name={`translations.${lang}.description`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Descricao</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Descricao da categoria" rows={2} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
            </LangTabs>

            <FormField
              control={form.control}
              name="parentId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoria pai</FormLabel>
                  <Select
                    onValueChange={(val) =>
                      field.onChange(val === "__none__" ? null : val)
                    }
                    value={field.value ?? "__none__"}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Nenhuma (raiz)" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="__none__">Nenhuma (raiz)</SelectItem>
                      {flatOptions.map(({ node, depth }) => (
                        <SelectItem key={node.id} value={node.id}>
                          {"—".repeat(depth)} {getCategoryName(node)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

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

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {isEditing ? "Salvar" : "Criar"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
