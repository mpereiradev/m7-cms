import { z } from "zod";

export const inviteUserSchema = z.object({
  email: z.string().email("E-mail invalido"),
  role: z.enum(["admin", "editor", "author", "viewer"], {
    message: "Selecione um papel",
  }),
});

export const changeRoleSchema = z.object({
  role: z.enum(["admin", "editor", "author", "viewer"], {
    message: "Selecione um papel",
  }),
});

export type InviteUserFormValues = z.infer<typeof inviteUserSchema>;
export type ChangeRoleFormValues = z.infer<typeof changeRoleSchema>;
