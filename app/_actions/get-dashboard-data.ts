"use server";

import { db } from "@/app/_lib/prisma";
import {
  startOfDay,
  endOfDay,
  format,
  eachDayOfInterval,
  subDays,
} from "date-fns";

export async function getDashboardData(dateRange?: { from: Date; to: Date }) {
  // Define um período padrão (últimos 7 dias) se não houver filtro
  const startDate = dateRange?.from || subDays(new Date(), 7);
  const endDate = dateRange?.to || new Date();

  const where = {
    createdAt: {
      gte: startOfDay(startDate),
      lte: endOfDay(endDate),
    },
  };

  // 1. Busca totalizadores (Cards)
  const totalLabels = await db.labelGeneration.aggregate({
    where,
    _sum: { quantity: true },
  });

  const activeSectorsCount = await db.sector.count({
    where: { labelGenerations: { some: where } },
  });

  const printersCount = await db.printer.count();

  // 2. Dados para Gráfico de Setor (BarChart)
  const sectorsData = await db.sector.findMany({
    select: {
      name: true,
      _count: {
        select: { labelGenerations: { where } },
      },
      labelGenerations: {
        where,
        select: { quantity: true },
      },
    },
  });

  const formattedSectors = sectorsData
    .map((s) => ({
      name: s.name,
      total: s.labelGenerations.reduce((acc, curr) => acc + curr.quantity, 0),
    }))
    .sort((a, b) => b.total - a.total);

  // 3. Dados para Gráfico de Modelo (PieChart)
  const modelsData = await db.labelModel.findMany({
    select: {
      name: true,
      labelGenerations: {
        where,
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

  // 4. Dados para Tendência Temporal (LineChart)
  const timelineData = await db.labelGeneration.findMany({
    where,
    select: { createdAt: true, quantity: true },
  });

  // Preenche dias vazios no intervalo para o gráfico não ficar quebrado
  const days = eachDayOfInterval({ start: startDate, end: endDate });
  const formattedTimeline = days.map((day) => {
    const dayStr = format(day, "dd/MM");
    const totalDay = timelineData
      .filter((item) => format(item.createdAt, "dd/MM") === dayStr)
      .reduce((acc, curr) => acc + curr.quantity, 0);

    return { date: dayStr, qtd: totalDay };
  });

  return {
    totalLabels: totalLabels._sum.quantity || 0,
    activeSectorsCount,
    printersCount,
    avgPerOrder:
      timelineData.length > 0
        ? (totalLabels._sum.quantity || 0) / timelineData.length
        : 0,
    formattedSectors,
    formattedModels,
    formattedTimeline,
  };
}
