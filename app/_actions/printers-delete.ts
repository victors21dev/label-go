"use server";

import { db } from "@/app/_lib/prisma";

export async function deletePrinter(id: string) {
  try {
    await db.printer.delete({
      where: { id },
    });

    return { success: true };
  } catch (error) {
    console.error("Erro ao deletar:", error);
    return { success: false, error: "Não foi possível excluir a impressora." };
  }
}
