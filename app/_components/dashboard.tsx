"use client";

import React, { useState } from "react";
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
import { Printer, Tag, Users, LayoutDashboard, Loader2 } from "lucide-react";
import { getDashboardData } from "@/app/_actions/get-dashboard-data";

const COLORS = ["#2563eb", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

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
    <div className="space-y-8 min-h-screen mt-4">
      {/* HEADER */}
      <div className="flex items-center justify-end">
        <div className="flex items-center gap-4">
          {isLoading && (
            <Loader2 className="animate-spin text-primary" size={20} />
          )}
          <DateRangePicker date={date} onDateChange={handleDateChange} />
        </div>
      </div>

      {/* CARDS */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
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
          <CardHeader className="flex flex-row items-center justify-between pb-2">
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
          <CardHeader className="flex flex-row items-center justify-between pb-2">
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
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Média por Pedido
            </CardTitle>
            <LayoutDashboard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Number(data.avgPerOrder).toFixed(1)}
            </div>
            <p className="text-xs text-muted-foreground">
              Volume médio por solicitação
            </p>
          </CardContent>
        </Card>
      </div>

      {/* GRÁFICOS SUPERIORES */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* LINHA */}
        <Card className="col-span-4 min-w-0">
          <CardHeader>
            <CardTitle>Tendência de Impressão</CardTitle>
            <CardDescription>
              Volume diário de etiquetas geradas.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="w-full h-[300px]">
              {data.formattedTimeline?.length > 0 && (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data.formattedTimeline}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="date" fontSize={12} />
                    <YAxis fontSize={12} />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="qtd"
                      stroke="#2563eb"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>

        {/* PIZZA */}
        <Card className="col-span-3 min-w-0">
          <CardHeader>
            <CardTitle>Distribuição por Modelo</CardTitle>
            <CardDescription>Uso por tipo de etiqueta.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="w-full h-[300px]">
              {data.formattedModels?.length > 0 && (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data.formattedModels}
                      innerRadius={60}
                      outerRadius={90}
                      dataKey="value"
                    >
                      {data.formattedModels.map((_: any, index: number) => (
                        <Cell
                          key={index}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* BARRAS */}
      <Card className="min-w-0">
        <CardHeader>
          <CardTitle>Consumo por Setor</CardTitle>
          <CardDescription>
            Ranking de departamentos por volume de impressão.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="w-full h-[350px]">
            {data.formattedSectors?.length > 0 && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.formattedSectors}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip />
                  <Bar dataKey="total" fill="#2563eb" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
