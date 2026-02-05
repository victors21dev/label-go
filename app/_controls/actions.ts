"use server";
import { db } from "../_lib/prisma";
import { configFormSchema, ConfigFormData } from "../config/schema/schemas";
import { revalidatePath } from "next/cache";

type AllowedModels =
  | "user"
  | "sector"
  | "printer"
  | "labelModel"
  | "labelGeneration";

export async function createGenericAction(
  data: ConfigFormData,
  modelKey: AllowedModels
) {
  const parsed = configFormSchema.safeParse(data);

  if (!parsed.success) {
    return { success: false, error: "Dados inválidos" };
  }
  try {
    const modelDelegate = (db as any)[modelKey];

    if (!modelDelegate) {
      throw new Error(`Modelo ${modelKey} não encontrado no Prisma`);
    }

    await modelDelegate.create({
      data: parsed.data,
    });

    revalidatePath("/config");

    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Erro ao salvar no banco" };
  }
}
