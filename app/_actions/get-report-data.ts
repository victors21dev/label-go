"use server";

import { db } from "@/app/_lib/prisma";
import { startOfDay, endOfDay, subDays } from "date-fns";

export async function getReportData(filters: {
  from?: Date;
  to?: Date;
}) {
  const startDate = filters?.from || subDays(new Date(), 30);
  const endDate = filters?.to || new Date();

  const baseWhere: any = {
    createdAt: {
      gte: startOfDay(startDate),
      lte: endOfDay(endDate),
    },
    status: "GENERATED",
  };

  const sectors = await db.sector.findMany({
    select: {
      id: true,
      name: true,
      coordinatorName: true,
      labelGenerations: {
        where: baseWhere,
        select: { quantity: true, date: true },
      },
    },
    orderBy: { name: "asc" },
  });

  const rows = sectors
    .map((s) => ({
      id: s.id,
      name: s.name,
      coordinator: s.coordinatorName || "—",
      total: s.labelGenerations.reduce((acc, curr) => acc + curr.quantity, 0),
      orders: s.labelGenerations.length,
    }))
    .filter((s) => s.total > 0)
    .sort((a, b) => b.total - a.total);

  const grandTotal = rows.reduce((acc, r) => acc + r.total, 0);
  const totalOrders = rows.reduce((acc, r) => acc + r.orders, 0);

  return { rows, grandTotal, totalOrders, from: startDate, to: endDate };
}
