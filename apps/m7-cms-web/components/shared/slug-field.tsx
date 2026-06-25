"use client";

import { useEffect, useRef, useState } from "react";
import { type UseFormReturn } from "react-hook-form";
import { Pencil, Check } from "lucide-react";
import { slugify } from "@/lib/utils/slugify";
import { Input } from "@/components/ui/input";
import { FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form";

type SlugFieldProps = {
  form: UseFormReturn<any>;
  sourceField: string;
  slugField?: string;
};

export function SlugField({
  form,
  sourceField,
  slugField = "slug",
}: SlugFieldProps) {
  const [isEditing, setIsEditing] = useState(false);
  const userTouched = useRef(false);
  const sourceValue = form.watch(sourceField) as string | undefined;
  const slugValue = form.watch(slugField) as string | undefined;
  const existingSlug = useRef(form.getValues(slugField) as string);

  useEffect(() => {
    if (userTouched.current || existingSlug.current) return;
    const generated = slugify(sourceValue ?? "");
    if (generated && generated !== slugValue) {
      form.setValue(slugField, generated, { shouldValidate: false });
    }
  }, [sourceValue, form, slugField, slugValue]);

  function handleManualChange(value: string) {
    userTouched.current = true;
    form.setValue(slugField, slugify(value), { shouldValidate: true });
  }

  function startEditing() {
    setIsEditing(true);
    userTouched.current = true;
  }

  function stopEditing() {
    setIsEditing(false);
  }

  if (isEditing) {
    return (
      <FormField
        control={form.control}
        name={slugField}
        render={({ field }) => (
          <FormItem>
            <div className="flex items-center gap-2">
              <FormControl>
                <Input
                  {...field}
                  autoFocus
                  onChange={(e) => handleManualChange(e.target.value)}
                  onBlur={() => stopEditing()}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      stopEditing();
                    }
                  }}
                  className="h-8 text-sm"
                  placeholder="slug-do-registro"
                />
              </FormControl>
              <button
                type="button"
                onClick={stopEditing}
                className="shrink-0 text-muted-foreground hover:text-foreground"
              >
                <Check className="h-4 w-4" />
              </button>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  }

  return (
    <FormField
      control={form.control}
      name={slugField}
      render={() => (
        <FormItem>
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <span>slug:</span>
            <span className="font-mono text-foreground/70">
              {slugValue || "..."}
            </span>
            <button
              type="button"
              onClick={startEditing}
              className="shrink-0 p-0.5 rounded hover:bg-muted hover:text-foreground transition-colors"
              title="Editar slug"
            >
              <Pencil className="h-3 w-3" />
            </button>
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
