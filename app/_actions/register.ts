"use server";

import { db } from "@/app/_lib/prisma";
import bcrypt from "bcrypt";
import { redirect } from "next/navigation";

export async function registerAction(prevState: any, formData: FormData) {
  const name = formData.get("name") as string;
  const username = formData.get("username") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const sectorId = formData.get("sectorId") as string;

  try {
    // 1. Verificar se o e-mail ou usuário já existem
    const userExists = await db.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (userExists) {
      return { error: "Usuário ou Email já cadastrados." };
    }

    // 2. Criptografar a senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Criar no banco de dados
    await db.user.create({
      data: {
        name,
        username,
        email,
        password: hashedPassword,
        sectorId: sectorId || null,
      },
    });
  } catch (error) {
    return { error: "Erro ao criar conta. Tente novamente." };
  }

  // 4. Redirecionar após sucesso (fora do try/catch)
  redirect("/login?success=account-created");
}
