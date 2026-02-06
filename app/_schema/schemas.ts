import { z } from "zod";

export const printerSchema = z.object({
  brand: z.string().min(3, "A marca deve ter pelo menos 3 caracteres"),
  model: z.string().min(3, "O modelo deve ter pelo menos 3 caracteres"),
});

export const labelSchema = z.object({
  name: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
  widthMm: z.coerce.number().positive("A largura deve ser maior que zero"),
  heightMm: z.coerce.number().positive("A altura deve ser maior que zero"),
});

export const configFormSchema = z.union([printerSchema, labelSchema]);

export type ConfigFormData = z.infer<typeof configFormSchema>;
