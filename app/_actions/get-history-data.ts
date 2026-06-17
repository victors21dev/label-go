"use server";

import { db } from "@/app/_lib/prisma";
import { startOfDay, endOfDay } from "date-fns";

export async function getHistoryData(filters?: {
  from?: Date;
  to?: Date;
  sectorId?: string;
  labelModelId?: string;
  printerId?: string;
  userId?: string;
  status?: string;
}) {
  const baseWhere: any = {};

  if (filters?.from || filters?.to) {
    baseWhere.createdAt = {};
    if (filters.from) baseWhere.createdAt.gte = startOfDay(filters.from);
    if (filters.to) baseWhere.createdAt.lte = endOfDay(filters.to);
  }
  if (filters?.sectorId) baseWhere.sectorId = filters.sectorId;
  if (filters?.labelModelId) baseWhere.labelModelId = filters.labelModelId;
  if (filters?.printerId) baseWhere.printerId = filters.printerId;
  if (filters?.userId) baseWhere.userId = filters.userId;
  if (filters?.status) baseWhere.status = filters.status;

  const data = await db.labelGeneration.findMany({
    where: baseWhere,
    include: {
      sector: true,
      user: true,
      labelModel: true,
      printer: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return data;
}

export async function getHistoryFilterOptions() {
  const sectors = await db.sector.findMany({
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });
  const models = await db.labelModel.findMany({
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });
  const printers = await db.printer.findMany({
    select: { id: true, brand: true, model: true },
    orderBy: [{ brand: "asc" }, { model: "asc" }],
  });
  const users = await db.user.findMany({
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });
  return { sectors, models, printers, users };
}
