"use server";
import { db } from "../_lib/prisma";

export async function saveLabels(data: any[]) {
  return await db.labelGeneration.createMany({
    data: data.map((item) => ({
      userId: item.userId,
      sectorId: item.sectorId,
      labelModelId: item.labelModelId,
      printerId: "c9b01385-b044-47a3-baa4-d776e89dc39e",
      quantity: item.quantity,
      date: item.date,
      justification: "",
      status: "GENERATED",
    })),
  });
}
