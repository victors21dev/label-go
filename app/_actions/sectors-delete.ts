"use server";

import { db } from "@/app/_lib/prisma";

export async function deleteSector(id: string) {
  try {
    await db.sector.delete({
      where: { id },
    });

    return { success: true };
  } catch (error) {
    console.error("Erro ao deletar:", error);
    return { success: false, error: "Não foi possível excluir o setor." };
  }
}
