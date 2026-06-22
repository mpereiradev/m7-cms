import { z } from "zod";

export const storeHoursSchema = z.object({
  dayOfWeek: z.number().min(0).max(6),
  isOpen: z.boolean(),
  openTime: z.string().nullable(),
  closeTime: z.string().nullable(),
});

export const storeFormSchema = z.object({
  name: z.string().min(1, "Nome da loja e obrigatorio"),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email("E-mail invalido").optional().or(z.literal("")),
  mapUrl: z.string().url("URL invalida").optional().or(z.literal("")),
  description: z.string().optional(),
  isActive: z.boolean(),
});

export const storeHoursFormSchema = z.object({
  hours: z.array(storeHoursSchema).length(7),
});

export type StoreFormValues = z.infer<typeof storeFormSchema>;
export type StoreHoursFormValues = z.infer<typeof storeHoursFormSchema>;
