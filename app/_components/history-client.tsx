"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "motion/react";
import { DateRangePicker } from "./date-range-picker";
import { DateRange } from "react-day-picker";
import {
  getHistoryData,
  getHistoryFilterOptions,
} from "@/app/_actions/get-history-data";
import { DataTable } from "./data-table";
import { historyTableColumns } from "@/app/(home)/history/_components/table-columns";
import { SearchableSelect } from "./ui/searchable-select";
import { Loader2, Infinity, CalendarDays } from "lucide-react";
import { Badge } from "./ui/badge";
import TitleToPage from "@/app/_components/title-page";

type PeriodMode = "period" | "all";

const MODE_CLASS = (active: boolean) =>
  active
    ? "bg-primary text-primary-foreground shadow-sm"
    : "bg-muted text-muted-foreground hover:bg-muted/80";

export default function HistoryClient({ initialData }: { initialData: any[] }) {
  const [isMounted, setIsMounted] = useState(false);
  const [data, setData] = useState(initialData);
  const [filterOptions, setFilterOptions] = useState<{
    sectors: { id: string; name: string }[];
    models: { id: string; name: string }[];
    printers: { id: string; brand: string; model: string }[];
    users: { id: string; name: string }[];
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [periodMode, setPeriodMode] = useState<PeriodMode>("period");
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(new Date().setDate(new Date().getDate() - 30)),
    to: new Date(),
  });
  const [sectorId, setSectorId] = useState("");
  const [labelModelId, setLabelModelId] = useState("");
  const [printerId, setPrinterId] = useState("");
  const [userId, setUserId] = useState("");

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await getHistoryData({
        from: periodMode === "period" ? date?.from : undefined,
        to: periodMode === "period" ? date?.to : undefined,
        sectorId: sectorId && sectorId !== "all" ? sectorId : undefined,
        labelModelId: labelModelId && labelModelId !== "all" ? labelModelId : undefined,
        printerId: printerId && printerId !== "all" ? printerId : undefined,
        userId: userId && userId !== "all" ? userId : undefined,
      });
      setData(result);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [date?.from, date?.to, periodMode, sectorId, labelModelId, printerId, userId]);

  useEffect(() => {
    setIsMounted(true);
    getHistoryFilterOptions().then(setFilterOptions);
  }, []);

  useEffect(() => {
    if (isMounted) fetchData();
  }, [fetchData, isMounted]);

  const hasFilters = sectorId || labelModelId || printerId || userId;

  if (!isMounted) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-muted-foreground" size={24} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <TitleToPage
        title="Histórico"
        description="Todas as etiquetas geradas no sistema"
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
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${MODE_CLASS(periodMode === "period")}`}
            >
              <CalendarDays className="size-3.5" />
              Período
            </button>
            <button
              onClick={() => setPeriodMode("all")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${MODE_CLASS(periodMode === "all")}`}
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
                className="w-[200px]"
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
                className="w-[200px]"
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
                className="w-[200px]"
              />
              <SearchableSelect
                value={userId}
                onValueChange={setUserId}
                placeholder="Todos os usuários"
                options={[
                  { value: "all", label: "Todos os usuários" },
                  ...filterOptions.users.map((u) => ({
                    value: u.id,
                    label: u.name,
                  })),
                ]}
                className="w-[200px]"
              />
            </>
          )}
          {hasFilters && (
            <button
              onClick={() => {
                setSectorId("");
                setLabelModelId("");
                setPrinterId("");
                setUserId("");
              }}
              className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-4"
            >
              Limpar filtros
            </button>
          )}
        </div>
      </div>

      {/* Summary badges */}
      <div className="flex flex-wrap items-center gap-3 text-sm">
        <Badge variant="secondary" className="gap-1.5 px-3 py-1.5">
          {data.length} registro{data.length !== 1 ? "s" : ""}
        </Badge>
        <Badge variant="secondary" className="gap-1.5 px-3 py-1.5">
          {(data as any[]).reduce((a, r) => a + r.quantity, 0).toLocaleString()} etiquetas
        </Badge>
      </div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <DataTable columns={historyTableColumns} data={data} />
      </motion.div>
    </div>
  );
}
