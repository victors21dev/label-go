"use server";

import { db } from "@/app/_lib/prisma";
import { revalidatePath } from "next/cache";
import { Role, UserStatus } from "@/generated/prisma/client";

export async function deleteUser(id: string) {
  try {
    await db.user.delete({
      where: { id },
    });

    revalidatePath("/users");

    return { success: true };
  } catch (error) {
    console.error("Erro ao deletar:", error);
    return { success: false, error: "Não foi possível excluir o usuário." };
  }
}

export async function updateUser(
  id: string,
  data: {
    name?: string;
    imageUrl?: string;
    role?: string;
    status?: string;
  }
) {
  try {
    await db.user.update({
      where: { id },
      data: {
        ...data,
        name: data.name ? String(data.name) : undefined,
        imageUrl: data.imageUrl ? String(data.imageUrl) : undefined,
        role: data.role ? (data.role as Role) : undefined,
        status: data.status ? (data.status as UserStatus) : undefined,
      },
    });

    revalidatePath("/users");

    return { success: true };
  } catch (error) {
    console.error("Erro ao atualizar:", error);
    return { success: false, error: "Erro ao salvar as alterações." };
  }
}
