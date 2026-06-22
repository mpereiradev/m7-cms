"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSettings, useBatchUpdateSettings } from "@/lib/hooks/use-settings";
import {
  settingsFormSchema,
  type SettingsFormValues,
} from "@/lib/schemas/settings.schema";
import type { Setting, SettingGroup } from "@/lib/api/settings.api";

const GROUP_LABELS: Record<SettingGroup, string> = {
  general: "Geral",
  seo: "SEO",
  integrations: "Integracoes",
  notifications: "Notificacoes",
};

const GROUP_DESCRIPTIONS: Record<SettingGroup, string> = {
  general: "Configuracoes gerais do site",
  seo: "Metadados e otimizacao para mecanismos de busca",
  integrations: "Integracoes com servicos de terceiros",
  notifications: "Configuracoes de notificacoes e e-mails",
};

function SettingField({
  setting,
  form,
}: {
  setting: Setting;
  form: ReturnType<typeof useForm<SettingsFormValues>>;
}) {
  const fieldName = `settings.${setting.key}` as const;

  if (setting.fieldType === "boolean") {
    return (
      <FormField
        control={form.control}
        name={fieldName}
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
            <FormControl>
              <Checkbox
                checked={field.value === "true"}
                onCheckedChange={(checked) =>
                  field.onChange(checked ? "true" : "false")
                }
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel>{setting.label}</FormLabel>
              {setting.description && (
                <FormDescription>{setting.description}</FormDescription>
              )}
            </div>
          </FormItem>
        )}
      />
    );
  }

  if (setting.fieldType === "select" && setting.options) {
    return (
      <FormField
        control={form.control}
        name={fieldName}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{setting.label}</FormLabel>
            <Select onValueChange={field.onChange} value={field.value || ""}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {setting.options!.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {setting.description && (
              <FormDescription>{setting.description}</FormDescription>
            )}
          </FormItem>
        )}
      />
    );
  }

  if (setting.fieldType === "textarea") {
    return (
      <FormField
        control={form.control}
        name={fieldName}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{setting.label}</FormLabel>
            <FormControl>
              <Textarea rows={3} {...field} value={field.value || ""} />
            </FormControl>
            {setting.description && (
              <FormDescription>{setting.description}</FormDescription>
            )}
          </FormItem>
        )}
      />
    );
  }

  // Default: text input
  return (
    <FormField
      control={form.control}
      name={fieldName}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{setting.label}</FormLabel>
          <FormControl>
            <Input {...field} value={field.value || ""} />
          </FormControl>
          {setting.description && (
            <FormDescription>{setting.description}</FormDescription>
          )}
        </FormItem>
      )}
    />
  );
}

export function SettingsForm() {
  const { data: settings, isLoading } = useSettings();
  const batchUpdate = useBatchUpdateSettings();

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsFormSchema),
    defaultValues: {
      settings: {},
    },
  });

  // Populate form when settings load
  useEffect(() => {
    if (settings) {
      const values: Record<string, string> = {};
      for (const setting of settings) {
        values[setting.key] = setting.value;
      }
      form.reset({ settings: values });
    }
  }, [settings, form]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-[200px]" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!settings || settings.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          Nenhuma configuracao disponivel
        </CardContent>
      </Card>
    );
  }

  // Group settings by group
  const grouped = settings.reduce<Record<SettingGroup, Setting[]>>(
    (acc, setting) => {
      const group = setting.group;
      if (!acc[group]) acc[group] = [];
      acc[group].push(setting);
      return acc;
    },
    {} as Record<SettingGroup, Setting[]>
  );

  const groups = Object.keys(grouped) as SettingGroup[];

  async function onSubmit(values: SettingsFormValues) {
    const entries = Object.entries(values.settings).map(([key, value]) => ({
      key,
      value,
    }));
    await batchUpdate.mutateAsync({ settings: entries });
  }

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Configuracoes</h1>
        <p className="text-muted-foreground">
          Gerencie as configuracoes gerais, SEO, integracoes e notificacoes do
          seu site.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Tabs defaultValue={groups[0]} className="w-full">
            <TabsList>
              {groups.map((group) => (
                <TabsTrigger key={group} value={group}>
                  {GROUP_LABELS[group] ?? group}
                </TabsTrigger>
              ))}
            </TabsList>

            {groups.map((group) => (
              <TabsContent key={group} value={group}>
                <Card>
                  <CardHeader>
                    <CardTitle>{GROUP_LABELS[group] ?? group}</CardTitle>
                    <CardDescription>
                      {GROUP_DESCRIPTIONS[group] ?? ""}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {grouped[group].map((setting) => (
                      <SettingField
                        key={setting.key}
                        setting={setting}
                        form={form}
                      />
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>

          <div className="flex justify-end">
            <Button type="submit" disabled={batchUpdate.isPending}>
              <Save className="mr-2 h-4 w-4" />
              {batchUpdate.isPending ? "Salvando..." : "Salvar Configuracoes"}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}
