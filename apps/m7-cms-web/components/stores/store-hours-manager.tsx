"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSetStoreHours } from "@/lib/hooks/use-stores";
import {
  storeHoursFormSchema,
  type StoreHoursFormValues,
} from "@/lib/schemas/store.schema";
import type { StoreHours } from "@/lib/api/stores.api";

const DAY_LABELS = [
  "Domingo",
  "Segunda-feira",
  "Terca-feira",
  "Quarta-feira",
  "Quinta-feira",
  "Sexta-feira",
  "Sabado",
];

function getDefaultHours(existingHours?: StoreHours[]): StoreHours[] {
  return Array.from({ length: 7 }, (_, i) => {
    const existing = existingHours?.find((h) => h.dayOfWeek === i);
    return {
      dayOfWeek: i,
      isOpen: existing?.isOpen ?? (i >= 1 && i <= 5), // Mon-Fri open by default
      openTime: existing?.openTime ?? "08:00",
      closeTime: existing?.closeTime ?? "18:00",
    };
  });
}

type StoreHoursManagerProps = {
  storeId: string;
  hours?: StoreHours[];
};

export function StoreHoursManager({ storeId, hours }: StoreHoursManagerProps) {
  const setHours = useSetStoreHours();

  const form = useForm<StoreHoursFormValues>({
    resolver: zodResolver(storeHoursFormSchema),
    defaultValues: {
      hours: getDefaultHours(hours),
    },
  });

  async function onSubmit(values: StoreHoursFormValues) {
    await setHours.mutateAsync({ id: storeId, data: values });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Horarios de Funcionamento</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-3">
              {DAY_LABELS.map((label, dayIndex) => (
                <div
                  key={dayIndex}
                  className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-3 py-2 border-b last:border-b-0"
                >
                  <span className="text-sm font-medium min-w-[120px]">
                    {label}
                  </span>

                  <FormField
                    control={form.control}
                    name={`hours.${dayIndex}.isOpen`}
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel className="text-sm font-normal">
                          Aberto
                        </FormLabel>
                      </FormItem>
                    )}
                  />

                  {form.watch(`hours.${dayIndex}.isOpen`) ? (
                    <>
                      <FormField
                        control={form.control}
                        name={`hours.${dayIndex}.openTime`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                type="time"
                                className="w-[130px]"
                                value={field.value ?? ""}
                                onChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`hours.${dayIndex}.closeTime`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                type="time"
                                className="w-[130px]"
                                value={field.value ?? ""}
                                onChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </>
                  ) : (
                    <span className="col-span-2 text-sm text-muted-foreground">
                      Fechado
                    </span>
                  )}
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-4">
              <Button type="submit" disabled={setHours.isPending}>
                {setHours.isPending
                  ? "Salvando..."
                  : "Salvar Horarios"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
