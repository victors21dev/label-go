"use server";

import { db } from "@/app/_lib/prisma";
import {
  startOfDay,
  endOfDay,
  format,
  eachDayOfInterval,
  subDays,
  differenceInDays,
} from "date-fns";

export async function getDashboardData(filters?: {
  from?: Date;
  to?: Date;
  sectorId?: string;
  labelModelId?: string;
  printerId?: string;
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
  if (filters?.sectorId) baseWhere.sectorId = filters.sectorId;
  if (filters?.labelModelId) baseWhere.labelModelId = filters.labelModelId;
  if (filters?.printerId) baseWhere.printerId = filters.printerId;

  // Total labels no período
  const totalAgg = await db.labelGeneration.aggregate({
    where: baseWhere,
    _sum: { quantity: true },
  });
  const totalLabels = totalAgg._sum.quantity || 0;
  const daysInRange = Math.max(differenceInDays(endDate, startDate) + 1, 1);
  const labelsPerDay = Math.round(totalLabels / daysInRange);

  // Setores ativos no período
  const activeSectorsCount = await db.sector.count({
    where: { labelGenerations: { some: baseWhere } },
  });

  // Total impressoras
  const printersCount = await db.printer.count();

  // Média por pedido
  const totalOrders = await db.labelGeneration.count({ where: baseWhere });
  const avgPerOrder = totalOrders > 0 ? totalLabels / totalOrders : 0;

  // Consumo de rolo (30m = 30000mm)
  const allModels = await db.labelModel.findMany({
    select: { id: true, name: true, heightMm: true, widthMm: true },
  });
  const generationsWithModel = await db.labelGeneration.findMany({
    where: {
      ...baseWhere,
      labelModelId: { not: undefined },
    },
    select: { labelModelId: true, quantity: true },
  });
  let totalMmUsed = 0;
  const modelUsage: Record<string, { name: string; qtd: number; mm: number; heightMm: number }> = {};
  for (const g of generationsWithModel) {
    const model = allModels.find((m) => m.id === g.labelModelId);
    if (!model) continue;
    const mm = model.heightMm * g.quantity;
    totalMmUsed += mm;
    if (!modelUsage[model.id]) modelUsage[model.id] = { name: model.name, qtd: 0, mm: 0, heightMm: model.heightMm };
    modelUsage[model.id].qtd += g.quantity;
    modelUsage[model.id].mm += mm;
  }
  const ROLL_MM = 30000; // 30m = 30000mm
  const rollsNeeded = Math.ceil(totalMmUsed / ROLL_MM);
  const totalCmUsed = Math.round(totalMmUsed / 10);
  const totalMetersUsed = Math.round(totalMmUsed / 1000);

  // Horário de pico
  const allGenerations = await db.labelGeneration.findMany({
    where: baseWhere,
    select: { createdAt: true, quantity: true },
  });
  const hourCount: Record<number, number> = {};
  for (const g of allGenerations) {
    const h = g.createdAt.getHours();
    hourCount[h] = (hourCount[h] || 0) + g.quantity;
  }
  let peakHour = 0;
  let peakQtd = 0;
  for (const [h, q] of Object.entries(hourCount)) {
    if (q > peakQtd) { peakQtd = q; peakHour = Number(h); }
  }
  const hourlyDistribution = Array.from({ length: 24 }, (_, i) => ({
    hour: `${String(i).padStart(2, "0")}:00`,
    qtd: hourCount[i] || 0,
  }));

  // Modelo mais usado
  const modelQtd: Record<string, number> = {};
  for (const g of generationsWithModel) {
    modelQtd[g.labelModelId] = (modelQtd[g.labelModelId] || 0) + g.quantity;
  }
  let topModelId = "";
  let topModelQtd = 0;
  for (const [id, q] of Object.entries(modelQtd)) {
    if (q > topModelQtd) { topModelQtd = q; topModelId = id; }
  }
  const mostUsedModel = allModels.find((m) => m.id === topModelId);

  // Dados para gráfico de setor (top 5 + "Outros")
  const sectorsData = await db.sector.findMany({
    select: {
      id: true,
      name: true,
      labelGenerations: {
        where: baseWhere,
        select: { quantity: true },
      },
    },
  });
  const rawSectors = sectorsData
    .map((s) => ({
      id: s.id,
      name: s.name,
      total: s.labelGenerations.reduce((acc, curr) => acc + curr.quantity, 0),
    }))
    .sort((a, b) => b.total - a.total);
  const top5 = rawSectors.slice(0, 5);
  const othersTotal = rawSectors.slice(5).reduce((acc, s) => acc + s.total, 0);
  const formattedSectors = othersTotal > 0
    ? [...top5, { id: "outros", name: "Outros", total: othersTotal }]
    : top5;

  // Dados para gráfico de modelo
  const modelsData = await db.labelModel.findMany({
    select: {
      name: true,
      labelGenerations: {
        where: baseWhere,
        select: { quantity: true },
      },
    },
  });
  const formattedModels = modelsData
    .map((m) => ({
      name: m.name,
      value: m.labelGenerations.reduce((acc, curr) => acc + curr.quantity, 0),
    }))
    .filter((m) => m.value > 0);

  // Timeline
  const timelineData = allGenerations;
  const days = eachDayOfInterval({ start: startDate, end: endDate });
  const formattedTimeline = days.map((day) => {
    const dayStr = format(day, "dd/MM");
    const totalDay = timelineData
      .filter((item) => format(item.createdAt, "dd/MM") === dayStr)
      .reduce((acc, curr) => acc + curr.quantity, 0);
    return { date: dayStr, qtd: totalDay };
  });

  // Etiquetas por impressora (all time + filtered)
  const printers = await db.printer.findMany({
    select: { id: true, brand: true, model: true },
  });
  const printerLabelsAll = await db.labelGeneration.groupBy({
    by: ["printerId"],
    _sum: { quantity: true },
  });
  const printerLabelsFiltered = await db.labelGeneration.groupBy({
    by: ["printerId"],
    where: baseWhere,
    _sum: { quantity: true },
  });
  const labelsPerPrinter = printers.map((p) => {
    const all = printerLabelsAll.find((pl) => pl.printerId === p.id);
    const filtered = printerLabelsFiltered.find((pl) => pl.printerId === p.id);
    return {
      id: p.id,
      name: `${p.brand} ${p.model}`,
      total: all?._sum.quantity || 0,
      period: filtered?._sum.quantity || 0,
    };
  }).sort((a, b) => b.total - a.total);

  return {
    totalLabels,
    activeSectorsCount,
    printersCount,
    avgPerOrder,
    formattedSectors,
    formattedModels,
    formattedTimeline,
    labelsPerDay,
    rollsNeeded,
    totalMmUsed,
    totalCmUsed,
    totalMetersUsed,
    peakHour,
    hourlyDistribution,
    mostUsedModel: mostUsedModel
      ? { name: mostUsedModel.name, qtd: topModelQtd }
      : null,
    topSectors: top5.map((s) => ({ name: s.name, total: s.total })),
    labelsPerPrinter,
    modelUsage: Object.values(modelUsage).sort((a, b) => b.qtd - a.qtd),
  };
}

export async function getFilterOptions() {
  const sectors = await db.sector.findMany({
    select: { id: true, name: true, coordinatorName: true },
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
  return { sectors, models, printers };
}
