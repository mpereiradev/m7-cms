"use client";

import { useState } from "react";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { setStoreHours, type StoreHour } from "@/lib/api/stores.api";
import { useQueryClient } from "@tanstack/react-query";

const WEEKDAY_LABELS = [
  "Domingo",
  "Segunda-feira",
  "Terca-feira",
  "Quarta-feira",
  "Quinta-feira",
  "Sexta-feira",
  "Sabado",
];

type LocalHour = {
  weekday: number;
  openTime: string;
  closeTime: string;
};

type StoreHoursManagerProps = {
  storeId: string;
  hours: StoreHour[];
};

export function StoreHoursManager({ storeId, hours }: StoreHoursManagerProps) {
  const queryClient = useQueryClient();
  const [localHours, setLocalHours] = useState<LocalHour[]>(
    hours.map((h) => ({
      weekday: h.weekday,
      openTime: h.openTime.slice(0, 5),
      closeTime: h.closeTime.slice(0, 5),
    }))
  );
  const [isSaving, setIsSaving] = useState(false);

  const usedWeekdays = new Set(localHours.map((h) => h.weekday));

  function addHour() {
    const nextDay = Array.from({ length: 7 }, (_, i) => i).find(
      (d) => !usedWeekdays.has(d)
    );
    if (nextDay === undefined) return;
    setLocalHours((prev) => [
      ...prev,
      { weekday: nextDay, openTime: "08:00", closeTime: "18:00" },
    ]);
  }

  function removeHour(index: number) {
    setLocalHours((prev) => prev.filter((_, i) => i !== index));
  }

  function updateHour(index: number, field: keyof LocalHour, value: string | number) {
    setLocalHours((prev) =>
      prev.map((h, i) => (i === index ? { ...h, [field]: value } : h))
    );
  }

  async function handleSave() {
    setIsSaving(true);
    try {
      await setStoreHours(storeId, {
        hours: localHours.map((h) => ({
          weekday: h.weekday,
          openTime: h.openTime,
          closeTime: h.closeTime,
        })),
      });
      queryClient.invalidateQueries({ queryKey: ["stores"] });
      toast.success("Horarios salvos com sucesso!");
    } catch (error) {
      toast.error("Erro ao salvar horarios", {
        description:
          error instanceof Error ? error.message : "Erro desconhecido",
      });
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Horarios de atendimento</CardTitle>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addHour}
          disabled={usedWeekdays.size >= 7}
        >
          <Plus className="mr-1 h-4 w-4" />
          Adicionar dia
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {localHours.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            Nenhum horario cadastrado. Clique em &quot;Adicionar dia&quot; para comecar.
          </p>
        ) : (
          localHours
            .sort((a, b) => a.weekday - b.weekday)
            .map((hour, index) => (
              <div
                key={`${hour.weekday}-${index}`}
                className="flex items-center gap-3"
              >
                <Select
                  value={String(hour.weekday)}
                  onValueChange={(val) =>
                    updateHour(index, "weekday", parseInt(val))
                  }
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {WEEKDAY_LABELS.map((label, day) => (
                      <SelectItem
                        key={day}
                        value={String(day)}
                        disabled={usedWeekdays.has(day) && day !== hour.weekday}
                      >
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Input
                  type="time"
                  value={hour.openTime}
                  onChange={(e) => updateHour(index, "openTime", e.target.value)}
                  className="w-[130px]"
                />

                <span className="text-muted-foreground text-sm">ate</span>

                <Input
                  type="time"
                  value={hour.closeTime}
                  onChange={(e) =>
                    updateHour(index, "closeTime", e.target.value)
                  }
                  className="w-[130px]"
                />

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeHour(index)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            ))
        )}

        <div className="flex justify-end pt-2">
          <Button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Salvar horarios
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
