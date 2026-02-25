"use server";

import { db } from "@/app/_lib/prisma";

export async function getSectors() {
  try {
    const sectors = await db.sector.findMany({
      orderBy: {
        name: "asc",
      },
    });
    return sectors;
  } catch (error) {
    return [];
  }
}
