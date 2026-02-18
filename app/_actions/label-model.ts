"use server";

import { db } from "@/app/_lib/prisma";
import { revalidatePath } from "next/cache";

/**
 * Deleta um modelo de etiqueta.
 * Sempre retornamos um objeto para evitar o erro 'unexpected response'.
 */
export async function deleteLabelModel(id: string) {
  try {
    await db.labelModel.delete({
      where: { id },
    });

    // Revalida o caminho para atualizar a tabela no cliente
    revalidatePath("/config");

    return { success: true };
  } catch (error) {
    console.error("Erro ao deletar:", error);
    return { success: false, error: "Não foi possível excluir o item." };
  }
}

/**
 * Atualiza um modelo de etiqueta.
 */
export async function updateLabelModel(
  id: string,
  data: { name?: string; widthMm?: number; heightMm?: number }
) {
  try {
    await db.labelModel.update({
      where: { id },
      data: {
        ...data,
        // Garante que números sejam tratados corretamente se vierem como string do form
        widthMm: data.widthMm ? Number(data.widthMm) : undefined,
        heightMm: data.heightMm ? Number(data.heightMm) : undefined,
      },
    });

    revalidatePath("/config");

    return { success: true };
  } catch (error) {
    console.error("Erro ao atualizar:", error);
    return { success: false, error: "Erro ao salvar as alterações." };
  }
}
