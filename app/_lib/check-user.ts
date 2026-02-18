import { auth, currentUser } from "@clerk/nextjs/server";
import { db } from "./prisma";
import { redirect } from "next/navigation";

export async function checkUserStatus() {
  const { userId } = await auth();
  if (!userId) return null;

  // 1. Tenta buscar o usuário no banco primeiro
  let user = await db.user.findUnique({
    where: { id: userId },
  });

  // 2. Se não existe, busca dados do Clerk e cria
  if (!user) {
    const user_current = await currentUser();
    if (!user_current) return null;

    user = await db.user.create({
      data: {
        id: userId,
        status: "UNAUTHORIZED",
        role: "USER",
        name:
          `${user_current.firstName ?? ""} ${
            user_current.lastName ?? ""
          }`.trim() || "Usuário",
        imageUrl: user_current.imageUrl,
      },
    });
  }

  // 3. Redirecionamento de segurança
  // IMPORTANTE: Verifique se a URL atual já não é /unauthorized para evitar loop infinito
  if (user.status === "UNAUTHORIZED") {
    // Note: redirect() lança um erro que o Next.js captura para mudar de rota
    redirect("/unauthorized");
  }

  return user;
}
