"use server";

import { db } from "@/app/_lib/prisma";
import { revalidatePath } from "next/cache";

export async function deleteLabelModel(id: string) {
  try {
    await db.labelModel.delete({
      where: { id },
    });

    return { success: true };
  } catch (error) {
    console.error("Erro ao deletar:", error);
    return { success: false, error: "Não foi possível excluir o item." };
  }
}

export async function updateLabelModel(
  id: string,
  data: { name?: string; widthMm?: number; heightMm?: number }
) {
  try {
    await db.labelModel.update({
      where: { id },
      data: {
        ...data,
        widthMm: data.widthMm ? Number(data.widthMm) : undefined,
        heightMm: data.heightMm ? Number(data.heightMm) : undefined,
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Erro ao atualizar:", error);
    return { success: false, error: "Erro ao salvar as alterações." };
  }
}
