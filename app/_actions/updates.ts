"use server";
import { db } from "@/app/_lib/prisma";
import { Role, UserStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function updateDataAction(
  id: string,
  type: string,
  formData: FormData
) {
  const data = Object.fromEntries(formData.entries());
  if (type === "user") {
    await db.user.update({
      where: { id },
      data: {
        name: data.name as string,
        email: data.email as string,
        role: data.role as Role,
        status: data.status as UserStatus,
        // Se você quiser permitir trocar o setor pelo ID:
        sectorId: (data.sectorId as string) || null,
      },
    });
  } else if (type === "sector") {
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

export async function getSectors() {
  return await db.sector.findMany({
    orderBy: { name: "asc" },
  });
}
