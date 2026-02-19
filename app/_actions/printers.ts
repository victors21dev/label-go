"use server";

import { db } from "@/app/_lib/prisma";
import { revalidatePath } from "next/cache";

export async function deletePrinter(id: string) {
  try {
    await db.printer.delete({
      where: { id },
    });

    revalidatePath("/printers");

    return { success: true };
  } catch (error) {
    console.error("Erro ao deletar:", error);
    return { success: false, error: "Não foi possível excluir a impressora." };
  }
}

export async function updatePrinter(
  id: string,
  data: {
    brand?: string;
    model?: string;
  }
) {
  try {
    await db.printer.update({
      where: { id },
      data: {
        ...data,
        brand: data.brand ? String(data.brand) : undefined,
        model: data.model ? String(data.model) : undefined,
      },
    });

    revalidatePath("/printers");

    return { success: true };
  } catch (error) {
    console.error("Erro ao atualizar:", error);
    return { success: false, error: "Erro ao salvar as alterações." };
  }
}
