"use server";
import { db } from "@/app/_lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateDataAction(
  id: string,
  type: string,
  formData: FormData
) {
  const data = Object.fromEntries(formData.entries());

  if (type === "sector") {
    await db.sector.update({
      where: { id },
      data: {
        name: data.name as string,
        coordinatorName: data.coordinatorName as string,
      },
    });
  } else if (type === "printer") {
    await db.printer.update({
      where: { id },
      data: { brand: data.brand as string, model: data.model as string },
    });
  } else if (type === "labelmodel") {
    await db.labelModel.update({
      where: { id },
      data: {
        name: data.name as string,
        widthMm: parseFloat(data.widthMm as string),
        heightMm: parseFloat(data.heightMm as string),
      },
    });
  }

  revalidatePath("/"); // Atualiza a tabela automaticamente
  return { success: true };
}
