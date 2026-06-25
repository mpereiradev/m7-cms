"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { LangTabs } from "@/components/shared/lang-tabs";
import { useCreateStore, useUpdateStore } from "@/lib/hooks/use-stores";
import { SlugField } from "@/components/shared/slug-field";
import {
  storeFormSchema,
  type StoreFormValues,
} from "@/lib/schemas/store.schema";
import type { Store } from "@/lib/api/stores.api";

type StoreFormProps = {
  store?: Store;
};

function getTranslation(store: Store | undefined, lang: string) {
  if (!store) return undefined;
  return store.translations.find((t) => t.languageCode === lang);
}

export function StoreForm({ store }: StoreFormProps) {
  const router = useRouter();
  const createStore = useCreateStore();
  const updateStore = useUpdateStore();
  const isEditing = !!store;

  const ptBr = getTranslation(store, "pt-BR");
  const en = getTranslation(store, "en");

  const form = useForm<StoreFormValues>({
    resolver: zodResolver(storeFormSchema),
    defaultValues: {
      slug: store?.slug ?? "",
      mapUrl: store?.mapUrl ?? "",
      email: ptBr?.email ?? "",
      phone: ptBr?.phone ?? "",
      whatsapp: ptBr?.whatsapp ?? "",
      translations: {
        "pt-BR": {
          languageCode: "pt-BR",
          name: ptBr?.name ?? "",
          address: ptBr?.address ?? "",
          description: ptBr?.description ?? "",
        },
        en: {
          languageCode: "en",
          name: en?.name ?? "",
          address: en?.address ?? "",
          description: en?.description ?? "",
        },
      },
    },
  });

  const isSubmitting = createStore.isPending || updateStore.isPending;

  async function onSubmit(values: StoreFormValues) {
    const sharedContact = {
      email: values.email || undefined,
      phone: values.phone || undefined,
      whatsapp: values.whatsapp || undefined,
    };

    const translations = Object.values(values.translations)
      .filter((t) => t.name)
      .map((t) => ({ ...t, ...sharedContact }));

    const payload = {
      slug: values.slug,
      mapUrl: values.mapUrl || undefined,
      translations,
    };

    try {
      if (isEditing) {
        await updateStore.mutateAsync({ id: store.id, data: payload });
        toast.success("Loja atualizada com sucesso!");
      } else {
        await createStore.mutateAsync(payload);
        toast.success("Loja criada com sucesso!");
      }
      router.push("/stores");
    } catch (error) {
      toast.error(
        isEditing ? "Erro ao atualizar loja" : "Erro ao criar loja",
        {
          description:
            error instanceof Error ? error.message : "Erro desconhecido",
        }
      );
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Informacoes da Loja</CardTitle>
          </CardHeader>
          <CardContent>
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
                            <Input placeholder="Nome da loja" {...field} />
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
                    name={`translations.${lang}.address`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Endereco</FormLabel>
                        <FormControl>
                          <Input placeholder="Rua, numero, bairro, cidade - UF, CEP" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`translations.${lang}.description`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Descricao</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Descricao da loja..." rows={3} {...field} />
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
            <CardTitle>Contato e localizacao</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-mail</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="contato@loja.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefone</FormLabel>
                    <FormControl>
                      <Input placeholder="(00) 0000-0000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="whatsapp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>WhatsApp</FormLabel>
                    <FormControl>
                      <Input placeholder="(00) 00000-0000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="mapUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Link do Mapa</FormLabel>
                  <FormControl>
                    <Input placeholder="https://maps.google.com/..." {...field} />
                  </FormControl>
                  <FormDescription>
                    URL do Google Maps ou similar
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/stores")}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEditing ? "Salvar Alteracoes" : "Criar Loja"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
