"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
  DialogDescription,
} from "@/components/ui/dialog";
import {
  socialPostSchema,
  detectPlatform,
  type SocialPostFormValues,
  type SocialPlatform,
} from "@/lib/schemas/social-post.schema";

const platformLabels: Record<SocialPlatform, string> = {
  instagram: "Instagram",
  facebook: "Facebook",
  tiktok: "TikTok",
  x: "X (Twitter)",
  linkedin: "LinkedIn",
  youtube: "YouTube",
  pinterest: "Pinterest",
  unknown: "Outro",
};

const platformColors: Record<SocialPlatform, string> = {
  instagram: "bg-pink-500/10 text-pink-700 border-pink-200",
  facebook: "bg-blue-500/10 text-blue-700 border-blue-200",
  tiktok: "bg-gray-900/10 text-gray-900 border-gray-300",
  x: "bg-gray-800/10 text-gray-800 border-gray-300",
  linkedin: "bg-blue-600/10 text-blue-800 border-blue-300",
  youtube: "bg-red-500/10 text-red-700 border-red-200",
  pinterest: "bg-red-600/10 text-red-800 border-red-300",
  unknown: "bg-gray-400/10 text-gray-600 border-gray-200",
};

type SocialFormProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: SocialPostFormValues) => void;
  defaultValues?: Partial<SocialPostFormValues>;
  isLoading?: boolean;
  mode?: "create" | "edit";
};

export function SocialForm({
  open,
  onOpenChange,
  onSubmit,
  defaultValues,
  isLoading = false,
  mode = "create",
}: SocialFormProps) {
  const form = useForm<SocialPostFormValues>({
    resolver: zodResolver(socialPostSchema),
    defaultValues: {
      url: "",
      isActive: true,
      ...defaultValues,
    },
  });

  const urlValue = form.watch("url");
  const detectedPlatform = urlValue ? detectPlatform(urlValue) : null;

  useEffect(() => {
    if (defaultValues) {
      form.reset({ url: "", isActive: true, ...defaultValues });
    }
  }, [defaultValues, form]);

  function handleSubmit(data: SocialPostFormValues) {
    const platform = detectPlatform(data.url);
    onSubmit({ ...data, platform });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Nova publicacao social" : "Editar publicacao"}
          </DialogTitle>
          <DialogDescription>
            Cole a URL da publicacao de rede social. A plataforma sera detectada
            automaticamente.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL da publicacao</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://instagram.com/p/..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {detectedPlatform && detectedPlatform !== "unknown" && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  Plataforma detectada:
                </span>
                <Badge
                  variant="outline"
                  className={platformColors[detectedPlatform]}
                >
                  {platformLabels[detectedPlatform]}
                </Badge>
              </div>
            )}

            {detectedPlatform === "unknown" && urlValue.length > 0 && (
              <p className="text-sm text-amber-600">
                Plataforma nao reconhecida. A publicacao sera salva mesmo assim.
              </p>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="animate-spin" />}
                {mode === "create" ? "Adicionar" : "Salvar"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export { platformLabels, platformColors };
