"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import {
  categoryFormSchema,
  type CategoryFormValues,
  type Category,
} from "@/lib/schemas/category.schema";
import {
  useCreateCategory,
  useUpdateCategory,
} from "@/lib/hooks/use-categories";
import { LangTabs } from "@/components/shared/lang-tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
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
  const isEditing = !!category;

  const ptBr = category?.translations.find((t) => t.languageCode === "pt-BR");
  const en = category?.translations.find((t) => t.languageCode === "en");

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      parentId: category?.parentId ?? null,
      displayOrder: category?.displayOrder ?? 0,
      translations: {
        "pt-BR": {
          languageCode: "pt-BR",
          name: ptBr?.name ?? "",
          slug: ptBr?.slug ?? "",
        },
        en: {
          languageCode: "en",
          name: en?.name ?? "",
          slug: en?.slug ?? "",
        },
      },
    },
  });

  async function onSubmit(values: CategoryFormValues) {
    const translations = Object.values(values.translations).filter(
      (t) => t.name && t.slug
    );

    const payload = {
      parentId: values.parentId,
      displayOrder: values.displayOrder,
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
                  <FormField
                    control={form.control}
                    name={`translations.${lang}.name`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Nome {lang === "en" ? "(English)" : "(Portugues)"}
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Nome da categoria"
                            {...field}
                          />
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
                          <Input
                            placeholder="nome-da-categoria"
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

            <FormField
              control={form.control}
              name="displayOrder"
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
