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
    // 1. Check if user exists
    const userExists = await db.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (userExists) {
      return { error: "Usuário ou Email já cadastrados." };
    }

    // 2. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Create in DB
    // Note: Ensure these Enums (USER, UNAUTHORIZED) match your schema exactly
    await db.user.create({
      data: {
        name,
        username,
        email,
        password: hashedPassword,
        sectorId: sectorId || null,
        role: "USER", // Added if your schema requires it
        status: "UNAUTHORIZED", // Added if your schema requires it
      },
    });
  } catch (error) {
    // Next.js redirect throws a special error; we must let it pass through
    if (error instanceof Error && error.message === "NEXT_REDIRECT") {
      throw error;
    }
    console.error("Registration error:", error);
    return { error: "Erro ao criar conta. Tente novamente." };
  }

  // 4. Redirect
  redirect("/login?success=account-created");
}
