"use server";

import { db } from "@/app/_lib/prisma";
import { revalidatePath } from "next/cache";

export async function deleteLabelModel(id: string) {
  await db.labelModel.delete({
    where: { id },
  });

  revalidatePath("/config");
}

export async function updateLabelModel(
  id: string,
  data: { name?: string; widthMm?: number; heightMm?: number }
) {
  await db.labelModel.update({
    where: { id },
    data,
  });

  revalidatePath("/config");
}
