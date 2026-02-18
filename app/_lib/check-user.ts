import { auth, currentUser } from "@clerk/nextjs/server";
import { db } from "./prisma";
import { redirect } from "next/navigation";

export async function checkUserStatus() {
  const { userId } = await auth();

  if (!userId) return null;

  let user = await db.user.findUnique({
    where: { id: userId },
  });

  const user_current = await currentUser();

  if (!user_current) return null;

  if (!user) {
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

  if (user.status === "UNAUTHORIZED") {
    redirect("/unauthorized");
  }

  return user;
}
