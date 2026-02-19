"use server";

import { db } from "@/app/_lib/prisma";
import { revalidatePath } from "next/cache";

export async function deleteSector(id: string) {
  try {
    await db.sector.delete({
      where: { id },
    });

    revalidatePath("/sectors");

    return { success: true };
  } catch (error) {
    console.error("Erro ao deletar:", error);
    return { success: false, error: "Não foi possível excluir o setor." };
  }
}

export async function updateSector(
  id: string,
  data: {
    name?: string;
    coordinatorName?: string;
  }
) {
  try {
    await db.sector.update({
      where: { id },
      data: {
        ...data,
        name: data.name ? String(data.name) : undefined,
        coordinatorName: data.coordinatorName
          ? String(data.coordinatorName)
          : undefined,
      },
    });

    revalidatePath("/sectors");

    return { success: true };
  } catch (error) {
    console.error("Erro ao atualizar:", error);
    return { success: false, error: "Erro ao salvar as alterações." };
  }
}
