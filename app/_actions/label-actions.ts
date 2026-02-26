// app/actions/label-actions.ts
"use server";
import { db } from "../_lib/prisma";

export async function createLabelRecords(data: any[]) {
  try {
    await db.labelGeneration.createMany({
      data: data.map((item) => ({
        userId: item.userId,
        sectorId: item.sectorId,
        labelModelId: item.labelModelId,
        printerId: item.printerId,
        quantity: item.quantity,
        date: item.date,
        justification: "",
        status: "GENERATED",
      })),
    });
    return { success: true };
  } catch (error) {
    console.error("Erro ao salvar no banco:", error);
    return { success: false };
  }
}
