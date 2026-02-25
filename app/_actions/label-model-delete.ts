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
