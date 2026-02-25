// app/_actions/login.ts
"use server";

import { db } from "@/app/_lib/prisma"; // Caminho do seu prisma client
import bcrypt from "bcrypt";
import { redirect } from "next/navigation";

export async function loginAction(prevState: any, formData: FormData) {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  const user = await db.user.findFirst({
    where: { username },
  });

  if (!user) {
    return { error: "Usuário ou senha inválidos" };
  }

  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    return { error: "Usuário ou senha inválidos" };
  }

  // 3. Se deu certo, aqui você criaria a sessão (Cookies, JWT ou NextAuth)
  console.log("Login realizado com sucesso!");

  redirect("/"); // Exemplo de redirecionamento
}
