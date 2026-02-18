import { auth } from "@clerk/nextjs/server";
import { db } from "./prisma";
import { redirect } from "next/navigation";

export async function checkUserStatus() {
  const { userId } = await auth();

  if (!userId) return null;

  let user = await db.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    user = await db.user.create({
      data: {
        id: userId,
        status: "UNAUTHORIZED",
        role: "USER",
      },
    });
  }

  if (user.status === "UNAUTHORIZED") {
    redirect("/unauthorized");
  }

  return user;
}
