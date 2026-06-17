"use server";

import { db } from "@/app/_lib/prisma";
import { Prisma } from "@prisma/client";

export async function deleteHistory(id: string) {
  try {
    await db.labelGeneration.delete({
      where: { id },
    });

    return { success: true };
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return { success: true };
    }
    return { success: false, error: "Não foi possível excluir o histórico." };
  }
}
