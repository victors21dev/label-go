"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "motion/react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/app/_components/ui/card";
import { DateRangePicker } from "./date-range-picker";
import { DateRange } from "react-day-picker";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Printer,
  Tag,
  LayoutDashboard,
  Loader2,
  TrendingUp,
  PieChartIcon,
  BarChart3,
  Clock,
  Award,
  CalendarDays,
  Infinity,
} from "lucide-react";
import {
  getDashboardData,
  getFilterOptions,
} from "@/app/_actions/get-dashboard-data";
import { SearchableSelect } from "@/app/_components/ui/searchable-select";
import TitleToPage from "@/app/_components/title-page";

const COLORS = [
  "#2563eb",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884d8",
  "#a855f7",
];

function AnimatedCounter({
  value,
  suffix = "",
}: {
  value: number | string;
  suffix?: string;
}) {
  const [display, setDisplay] = useState(0);
  const target =
    typeof value === "string" ? parseFloat(value.replace(/\./g, "")) : value;
  const ref = useRef<number>(0);

  useEffect(() => {
    if (target === 0) {
      setDisplay(0);
      return;
    }
    const duration = 800;
    const start = performance.now();
    const frame = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      ref.current = Math.round(eased * target);
      setDisplay(ref.current);
      if (progress < 1) requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
    return () => {
      ref.current = target;
    };
  }, [target]);

  const formatted = Number.isInteger(target)
    ? display.toLocaleString()
    : display.toFixed(1);

  return (
    <>
      {formatted}
      {suffix}
    </>
  );
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border rounded-xl shadow-lg px-4 py-3 text-sm">
      <p className="text-muted-foreground mb-1">{label}</p>
      {payload.map((entry: any, i: number) => (
        <p key={i} className="font-semibold" style={{ color: entry.color }}>
          {entry.name}: {entry.value.toLocaleString()}
        </p>
      ))}
    </div>
  );
}

interface FilterOptions {
  sectors: { id: string; name: string; coordinatorName: string | null }[];
  models: { id: string; name: string }[];
  printers: { id: string; brand: string; model: string }[];
}

interface DashboardProps {
  initialData: any;
}

type PeriodMode = "period" | "all";

const MODE_CLASS = (active: boolean) =>
  active
    ? "bg-primary text-primary-foreground shadow-sm"
    : "bg-muted text-muted-foreground hover:bg-muted/80";

export default function DashboardLayout({ initialData }: DashboardProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [data, setData] = useState(initialData || {});
  const [filterOptions, setFilterOptions] = useState<FilterOptions | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);

  // Filtros
  const [periodMode, setPeriodMode] = useState<PeriodMode>("period");
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(new Date().setDate(new Date().getDate() - 7)),
    to: new Date(),
  });
  const [sectorId, setSectorId] = useState("");
  const [labelModelId, setLabelModelId] = useState("");
  const [printerId, setPrinterId] = useState("");

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const newData = await getDashboardData({
        from: periodMode === "period" ? date?.from : undefined,
        to: periodMode === "period" ? date?.to : undefined,
        sectorId: sectorId && sectorId !== "all" ? sectorId : undefined,
        labelModelId:
          labelModelId && labelModelId !== "all" ? labelModelId : undefined,
        printerId: printerId && printerId !== "all" ? printerId : undefined,
      });
      setData(newData);
    } catch (error) {
      console.error("Erro ao atualizar dashboard:", error);
    } finally {
      setIsLoading(false);
    }
  }, [date?.from, date?.to, periodMode, sectorId, labelModelId, printerId]);

  useEffect(() => {
    setIsMounted(true);
    getFilterOptions().then(setFilterOptions);
  }, []);

  useEffect(() => {
    if (isMounted) fetchData();
  }, [fetchData, isMounted]);

  if (!isMounted) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-muted-foreground" size={24} />
      </div>
    );
  }

  const statCards = [
    {
      title: "Total de Etiquetas",
      key: "totalLabels",
      description:
        periodMode === "all" ? "Total geral" : "No período selecionado",
      icon: Tag,
      gradient: "from-blue-500/20 to-blue-500/5",
      iconBg: "bg-blue-500/15 text-blue-600 dark:text-blue-400",
      borderColor: "border-l-blue-500",
    },
    {
      title: "Etiquetas / Dia",
      key: "labelsPerDay",
      description:
        periodMode === "all" ? "Média geral diária" : "Média diária no período",
      icon: CalendarDays,
      gradient: "from-cyan-500/20 to-cyan-500/5",
      iconBg: "bg-cyan-500/15 text-cyan-600 dark:text-cyan-400",
      borderColor: "border-l-cyan-500",
    },
    {
      title: "Modelo + Usado",
      key: "mostUsedModel",
      description: data?.mostUsedModel?.qtd
        ? `${data.mostUsedModel.qtd.toLocaleString()} etiquetas`
        : "Nenhum",
      icon: Award,
      gradient: "from-amber-500/20 to-amber-500/5",
      iconBg: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
      borderColor: "border-l-amber-500",
      render: (d: any) => d?.mostUsedModel?.name || "—",
    },
    {
      title: "Horário de Pico",
      key: "peakHour",
      description: "Maior volume de impressão",
      icon: Clock,
      gradient: "from-purple-500/20 to-purple-500/5",
      iconBg: "bg-purple-500/15 text-purple-600 dark:text-purple-400",
      borderColor: "border-l-purple-500",
      render: (d: any) => `${String(d?.peakHour ?? 0).padStart(2, "0")}:00`,
    },
    {
      title: "Média por Pedido",
      key: "avgPerOrder",
      description: "Por solicitação",
      icon: LayoutDashboard,
      gradient: "from-rose-500/20 to-rose-500/5",
      iconBg: "bg-rose-500/15 text-rose-600 dark:text-rose-400",
      borderColor: "border-l-rose-500",
      render: (d: any) => (
        <>
          <AnimatedCounter value={Number(d?.avgPerOrder) || 0} />
          <span className="text-lg font-normal text-muted-foreground ml-1">
            /pedido
          </span>
        </>
      ),
    },
  ];

  return (
    <div className="space-y-10">
      {/* HEADER */}
      <TitleToPage
        title="Dashboard"
        description="Acompanhe aqui seus relatórios"
        icon={LayoutDashboard}
        iconBg="bg-chart-2/15 text-chart-2"
      />

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2 text-sm text-muted-foreground"
            >
              <Loader2 className="animate-spin" size={16} />
              Atualizando...
            </motion.div>
          )}
          <div className="flex items-center rounded-lg border p-0.5 bg-muted/50">
            <button
              onClick={() => setPeriodMode("period")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${MODE_CLASS(
                periodMode === "period"
              )}`}
            >
              <CalendarDays className="size-3.5" />
              Período
            </button>
            <button
              onClick={() => setPeriodMode("all")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${MODE_CLASS(
                periodMode === "all"
              )}`}
            >
              <Infinity className="size-3.5" />
              Todos
            </button>
          </div>
          {periodMode === "period" && (
            <DateRangePicker date={date} onDateChange={setDate} />
          )}
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {filterOptions && (
            <>
              <SearchableSelect
                value={sectorId}
                onValueChange={setSectorId}
                placeholder="Todos os setores"
                options={[
                  { value: "all", label: "Todos os setores" },
                  ...filterOptions.sectors.map((s) => ({
                    value: s.id,
                    label: s.name,
                  })),
                ]}
                className="w-50"
              />
              <SearchableSelect
                value={labelModelId}
                onValueChange={setLabelModelId}
                placeholder="Todos os modelos"
                options={[
                  { value: "all", label: "Todos os modelos" },
                  ...filterOptions.models.map((m) => ({
                    value: m.id,
                    label: m.name,
                  })),
                ]}
                className="w-50"
              />
              <SearchableSelect
                value={printerId}
                onValueChange={setPrinterId}
                placeholder="Todas as impressoras"
                options={[
                  { value: "all", label: "Todas as impressoras" },
                  ...filterOptions.printers.map((p) => ({
                    value: p.id,
                    label: `${p.brand} ${p.model}`,
                  })),
                ]}
                className="w-50"
              />
            </>
          )}
          {(sectorId || labelModelId || printerId) && (
            <button
              onClick={() => {
                setSectorId("");
                setLabelModelId("");
                setPrinterId("");
              }}
              className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-4"
            >
              Limpar filtros
            </button>
          )}
        </div>
      </div>

      {/* STAT CARDS — 6 cards */}
      <motion.div
        className="grid gap-5 grid-cols-2 md:grid-cols-3 lg:grid-cols-5"
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
      >
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.title}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              whileHover={{
                y: -5,
                transition: { type: "spring", stiffness: 300 },
              }}
              className="group"
            >
              <Card
                className={`border-l-4 ${card.borderColor} overflow-hidden card-hover h-full`}
              >
                <CardHeader className="flex flex-row items-start justify-between pb-2 gap-2">
                  <CardTitle className="text-xs font-medium text-muted-foreground leading-tight">
                    {card.title}
                  </CardTitle>
                  <div
                    className={`p-1.5 rounded-lg ${card.iconBg} transition-transform group-hover:scale-110 shrink-0`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="text-2xl font-bold tracking-tight">
                    {card.render ? (
                      card.render(data)
                    ) : (
                      <AnimatedCounter value={(data as any)[card.key] ?? 0} />
                    )}
                  </div>
                  <div className="h-1 w-full rounded-full bg-muted mt-3 overflow-hidden">
                    <motion.div
                      className={`h-full rounded-full ${
                        card.key === "totalLabels"
                          ? "bg-blue-500"
                          : card.key === "labelsPerDay"
                          ? "bg-cyan-500"
                          : card.key === "mostUsedModel"
                          ? "bg-amber-500"
                          : card.key === "peakHour"
                          ? "bg-purple-500"
                          : "bg-rose-500"
                      }`}
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 1, delay: 0.3 }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2 truncate">
                    {card.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      {/* CHARTS ROW */}
      <motion.div
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-7"
        initial="hidden"
        animate="visible"
        variants={{
          visible: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
        }}
      >
        {/* AREA CHART */}
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 30 },
            visible: { opacity: 1, y: 0 },
          }}
          className="lg:col-span-4 min-w-0"
        >
          <Card className="card-hover overflow-hidden">
            <CardHeader className="flex flex-row items-center gap-3 pb-2">
              <div className="p-2 rounded-lg bg-blue-500/15 text-blue-600 dark:text-blue-400">
                <TrendingUp className="h-4 w-4" />
              </div>
              <div>
                <CardTitle>Tendência de Impressão</CardTitle>
                <CardDescription>
                  Volume diário de etiquetas geradas
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="w-full h-75">
                {(data as any).formattedTimeline?.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={(data as any).formattedTimeline}
                      margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient
                          id="colorQtd"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#2563eb"
                            stopOpacity={0.3}
                          />
                          <stop
                            offset="95%"
                            stopColor="#2563eb"
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        stroke="currentColor"
                        className="stroke-border/50"
                      />
                      <XAxis
                        dataKey="date"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis fontSize={12} tickLine={false} axisLine={false} />
                      <Tooltip content={<CustomTooltip />} />
                      <Area
                        type="monotone"
                        dataKey="qtd"
                        stroke="#2563eb"
                        strokeWidth={2.5}
                        fill="url(#colorQtd)"
                        dot={false}
                        activeDot={{ r: 5, strokeWidth: 0 }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                    Nenhum dado no período
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* PIE CHART */}
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 30 },
            visible: { opacity: 1, y: 0 },
          }}
          className="lg:col-span-3 min-w-0"
        >
          <Card className="card-hover overflow-hidden h-full">
            <CardHeader className="flex flex-row items-center gap-3 pb-2">
              <div className="p-2 rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                <PieChartIcon className="h-4 w-4" />
              </div>
              <div>
                <CardTitle>Distribuição por Modelo</CardTitle>
                <CardDescription>Uso por tipo de etiqueta</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="w-full h-75">
                {(data as any).formattedModels?.length > 0 ? (
                  <div className="flex flex-col items-center justify-center h-full gap-3">
                    <ResponsiveContainer width="100%" height="68%">
                      <PieChart>
                        <Pie
                          data={(data as any).formattedModels}
                          innerRadius={50}
                          outerRadius={75}
                          dataKey="value"
                          paddingAngle={3}
                          strokeWidth={0}
                        >
                          {(data as any).formattedModels.map(
                            (_: any, index: number) => (
                              <Cell
                                key={index}
                                fill={COLORS[index % COLORS.length]}
                              />
                            )
                          )}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="flex flex-wrap justify-center gap-2 px-2">
                      {(data as any).formattedModels.map(
                        (entry: any, index: number) => (
                          <div
                            key={entry.name}
                            className="flex items-center gap-1.5 text-xs"
                          >
                            <span
                              className="w-2.5 h-2.5 rounded-full shrink-0"
                              style={{
                                backgroundColor: COLORS[index % COLORS.length],
                              }}
                            />
                            <span className="text-muted-foreground">
                              {entry.name}
                            </span>
                            <span className="font-medium">{entry.value}</span>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                    Nenhum dado no período
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* BOTTOM ROW: SECTOR BAR + PEAK HOURS */}
      <motion.div
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-7"
        initial="hidden"
        animate="visible"
        variants={{
          visible: { transition: { staggerChildren: 0.1, delayChildren: 0.3 } },
        }}
      >
        {/* BAR CHART — TOP 5 SETORES */}
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 30 },
            visible: { opacity: 1, y: 0 },
          }}
          className="lg:col-span-4 min-w-0"
        >
          <Card className="card-hover overflow-hidden">
            <CardHeader className="flex flex-row items-center gap-3 pb-2">
              <div className="p-2 rounded-lg bg-amber-500/15 text-amber-600 dark:text-amber-400">
                <BarChart3 className="h-4 w-4" />
              </div>
              <div>
                <CardTitle>Top 5 Setores</CardTitle>
                <CardDescription>
                  Ranking dos departamentos que mais solicitam
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="w-full h-85">
                {(data as any).formattedSectors?.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={(data as any).formattedSectors}
                      margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
                      barCategoryGap="25%"
                    >
                      <defs>
                        <linearGradient
                          id="colorSectorBar"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="0%"
                            stopColor="#2563eb"
                            stopOpacity={1}
                          />
                          <stop
                            offset="100%"
                            stopColor="#2563eb"
                            stopOpacity={0.6}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        stroke="currentColor"
                        className="stroke-border/50"
                      />
                      <XAxis
                        dataKey="name"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis fontSize={12} tickLine={false} axisLine={false} />
                      <Tooltip
                        content={<CustomTooltip />}
                        cursor={{
                          fill: "currentColor",
                          className: "fill-muted/50",
                        }}
                      />
                      <Bar
                        dataKey="total"
                        fill="url(#colorSectorBar)"
                        radius={[6, 6, 0, 0]}
                        maxBarSize={60}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                    Nenhum dado no período
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* PEAK HOURS BAR CHART */}
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 30 },
            visible: { opacity: 1, y: 0 },
          }}
          className="lg:col-span-3 min-w-0"
        >
          <Card className="card-hover overflow-hidden h-full">
            <CardHeader className="flex flex-row items-center gap-3 pb-2">
              <div className="p-2 rounded-lg bg-purple-500/15 text-purple-600 dark:text-purple-400">
                <Clock className="h-4 w-4" />
              </div>
              <div>
                <CardTitle>Horários de Pico</CardTitle>
                <CardDescription>
                  Volume de etiquetas por hora do dia
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="w-full h-85">
                {(data as any).hourlyDistribution?.some(
                  (h: any) => h.qtd > 0
                ) ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={(data as any).hourlyDistribution}
                      margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
                      barCategoryGap="8%"
                    >
                      <defs>
                        <linearGradient
                          id="colorHourBar"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="0%"
                            stopColor="#a855f7"
                            stopOpacity={1}
                          />
                          <stop
                            offset="100%"
                            stopColor="#a855f7"
                            stopOpacity={0.4}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        stroke="currentColor"
                        className="stroke-border/50"
                      />
                      <XAxis
                        dataKey="hour"
                        fontSize={11}
                        tickLine={false}
                        axisLine={false}
                        interval={2}
                      />
                      <YAxis fontSize={12} tickLine={false} axisLine={false} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar
                        dataKey="qtd"
                        fill="url(#colorHourBar)"
                        radius={[4, 4, 0, 0]}
                        maxBarSize={32}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                    Nenhum dado no período
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* IMPRESSORAS */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="card-hover overflow-hidden">
          <CardHeader className="flex flex-row items-center gap-3 pb-2">
            <div className="p-2 rounded-lg bg-purple-500/15 text-purple-600 dark:text-purple-400">
              <Printer className="h-4 w-4" />
            </div>
            <div>
              <CardTitle>Impressoras</CardTitle>
              <CardDescription>
                Total histórico + período filtrado
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            {(data as any).labelsPerPrinter?.length > 0 ? (
              <div className="space-y-3">
                {(data as any).labelsPerPrinter.map((p: any, i: number) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-muted-foreground w-5">
                        {i + 1}.
                      </span>
                      <div>
                        <p className="text-sm font-medium">{p.name}</p>
                        <p className="text-xs text-muted-foreground">
                          Total geral:{" "}
                          <strong>{p.total.toLocaleString()}</strong>
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold">
                        {p.period.toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        no período
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-32 text-muted-foreground text-sm">
                Nenhum dado
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
