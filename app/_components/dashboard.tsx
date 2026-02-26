"use client";

import React, { useState, useEffect } from "react";
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
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Printer,
  Tag,
  Users,
  LayoutDashboard,
  Calendar,
  Loader2,
} from "lucide-react";
import { getDashboardData } from "@/app/_actions/get-dashboard-data";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

interface DashboardProps {
  initialData: any;
}

export default function DashboardLayout({ initialData }: DashboardProps) {
  const [data, setData] = useState(
    initialData || {
      totalLabels: 0,
      activeSectorsCount: 0,
      printersCount: 0,
      avgPerOrder: 0,
      formattedSectors: [],
      formattedModels: [],
      formattedTimeline: [],
    }
  );
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(new Date().setDate(new Date().getDate() - 7)),
    to: new Date(),
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleDateChange = async (newRange: DateRange | undefined) => {
    setDate(newRange);
    if (newRange?.from && newRange?.to) {
      setIsLoading(true);
      try {
        const newData = await getDashboardData({
          from: newRange.from,
          to: newRange.to,
        });
        setData(newData);
      } catch (error) {
        console.error("Erro ao atualizar dashboard:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="p-8 space-y-8 bg-background min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Dashboard de Etiquetas
          </h1>
          <p className="text-muted-foreground">
            Consumo real extraído do banco de dados.
          </p>
        </div>
        <div className="flex items-center gap-4">
          {isLoading && (
            <Loader2 className="animate-spin text-primary" size={20} />
          )}
          <DateRangePicker date={date} onDateChange={handleDateChange} />
        </div>
      </div>

      {/* CARDS DE RESUMO COM DADOS REAIS */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Etiquetas
            </CardTitle>
            <Tag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.totalLabels.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Etiquetas físicas impressas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Setores Ativos
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.activeSectorsCount}</div>
            <p className="text-xs text-muted-foreground">
              Departamentos solicitantes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Uso de Impressoras
            </CardTitle>
            <Printer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.printersCount}</div>
            <p className="text-xs text-muted-foreground">Equipamentos em uso</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Média por Pedido
            </CardTitle>
            <LayoutDashboard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.avgPerOrder.toFixed(1)}
            </div>
            <p className="text-xs text-muted-foreground">
              Volume médio por solicitação
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* GRÁFICO DE LINHA - DADOS REAIS */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Tendência de Impressão</CardTitle>
            <CardDescription>
              Volume diário de etiquetas geradas.
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-75">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.formattedTimeline}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="date"
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="qtd"
                    stroke="#2563eb"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* GRÁFICO DE ROSCA - DADOS REAIS */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Distribuição por Modelo</CardTitle>
            <CardDescription>Uso por tipo de etiqueta.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-75">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.formattedModels}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {data.formattedModels.map((_: any, index: number) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-sm mt-4">
              {data.formattedModels.map((item: any, i: number) => (
                <div key={item.name} className="flex items-center gap-1">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: COLORS[i % COLORS.length] }}
                  />
                  <span className="text-xs">
                    {item.name} ({item.value})
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* GRÁFICO DE BARRAS - DADOS REAIS */}
      <Card>
        <CardHeader>
          <CardTitle>Consumo por Setor</CardTitle>
          <CardDescription>
            Ranking de departamentos por volume de impressão.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-87.5">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.formattedSectors}>
                <XAxis
                  dataKey="name"
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip cursor={{ fill: "transparent" }} />
                <Bar
                  dataKey="total"
                  fill="#2563eb"
                  radius={[4, 4, 0, 0]}
                  barSize={50}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
