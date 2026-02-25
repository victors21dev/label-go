"use server";

import { db } from "@/app/_lib/prisma";

export async function deleteUser(id: string) {
  try {
    await db.user.delete({
      where: { id },
    });

    return { success: true };
  } catch (error) {
    console.error("Erro ao deletar:", error);
    return { success: false, error: "Não foi possível excluir o usuário." };
  }
}
