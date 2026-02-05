import { z } from "zod";

export const configFormSchema = z.object({
  name: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
  widthMm: z.coerce.number().positive("A largura deve ser maior que zero"),
  heightMm: z.coerce.number().positive("A altura deve ser maior que zero"),
});

export type ConfigFormData = z.infer<typeof configFormSchema>;
