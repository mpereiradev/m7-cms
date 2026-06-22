import { z } from "zod";

export const settingsFormSchema = z.object({
  settings: z.record(z.string(), z.string()),
});

export type SettingsFormValues = z.infer<typeof settingsFormSchema>;
