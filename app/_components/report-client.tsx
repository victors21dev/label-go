"use client";

import { useState, useRef } from "react";
import { motion } from "motion/react";
import { DateRangePicker } from "./date-range-picker";
import { DateRange } from "react-day-picker";
import { getReportData } from "@/app/_actions/get-report-data";
import { Button } from "./ui/button";
import {
  FileText,
  Loader2,
  Printer,
  Building2,
  Hash,
  User,
  CalendarDays,
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import TitleToPage from "@/app/_components/title-page";

export default function ReportClient() {
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(new Date().setDate(new Date().getDate() - 30)),
    to: new Date(),
  });
  const [data, setData] = useState<{
    rows: { id: string; name: string; coordinator: string; total: number; orders: number }[];
    grandTotal: number;
    totalOrders: number;
    from: Date;
    to: Date;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  const handleGenerate = async () => {
    if (!date?.from || !date?.to) return;
    setIsLoading(true);
    try {
      const result = await getReportData({ from: date.from, to: date.to });
      setData(result);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrint = () => {
    const content = printRef.current;
    if (!content) return;
    const win = window.open("", "_blank");
    if (!win) return;
    const styles = Array.from(document.styleSheets)
      .map((sheet) => {
        try {
          return Array.from(sheet.cssRules || [])
            .map((rule) => rule.cssText)
            .join("");
        } catch {
          return "";
        }
      })
      .join("");
    win.document.write(`
      <html>
        <head>
          <title>Relatório de Impressões por Setor</title>
          <style>${styles}</style>
          <style>
            body { padding: 2rem; font-family: system-ui, sans-serif; }
            table { width: 100%; border-collapse: collapse; }
            th, td { padding: 0.5rem 1rem; text-align: left; border-bottom: 1px solid #e5e7eb; }
            th { font-weight: 600; color: #6b7280; font-size: 0.75rem; text-transform: uppercase; }
            .header { margin-bottom: 2rem; }
            .header h1 { font-size: 1.5rem; font-weight: 700; }
            .header p { color: #6b7280; }
            .total-row { font-weight: 700; background: #f9fafb; }
            .no-print { display: none; }
          </style>
        </head>
        <body>${content.innerHTML}</body>
      </html>
    `);
    win.document.close();
    setTimeout(() => { win.print(); }, 500);
  };

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <TitleToPage
        title="Relatório por Setor"
        description="Volume de etiquetas geradas por departamento em um período"
        icon={FileText}
        iconBg="bg-blue-500/15 text-blue-600 dark:text-blue-400"
      />

      {/* Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
        <div className="flex-1">
          <label className="text-sm font-medium text-muted-foreground mb-1.5 block">
            Período
          </label>
          <DateRangePicker date={date} onDateChange={setDate} />
        </div>
        <Button
          onClick={handleGenerate}
          disabled={isLoading}
          className="gap-2"
        >
          {isLoading ? (
            <Loader2 className="animate-spin size-4" />
          ) : (
            <FileText className="size-4" />
          )}
          {isLoading ? "Gerando..." : "Gerar Relatório"}
        </Button>
      </div>

      {/* Results */}
      {data && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div
            ref={printRef}
            className="bg-card border rounded-xl overflow-hidden"
          >
            {/* Print header */}
            <div className="p-6 pb-0">
              <h1 className="text-xl font-bold">Relatório de Impressões por Setor</h1>
              <p className="text-sm text-muted-foreground mt-1">
                {format(data.from, "dd/MM/yyyy", { locale: ptBR })} — {format(data.to, "dd/MM/yyyy", { locale: ptBR })}
              </p>
              <div className="flex gap-6 mt-3 text-sm">
                <span className="text-muted-foreground">
                  Total de etiquetas: <strong className="text-foreground">{data.grandTotal.toLocaleString()}</strong>
                </span>
                <span className="text-muted-foreground">
                  Total de pedidos: <strong className="text-foreground">{data.totalOrders}</strong>
                </span>
                <span className="text-muted-foreground">
                  Setores ativos: <strong className="text-foreground">{data.rows.length}</strong>
                </span>
              </div>
            </div>

            {/* Table */}
            <div className="p-6">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-muted-foreground text-xs uppercase tracking-wider">
                    <th className="text-left pb-3 font-medium">#</th>
                    <th className="text-left pb-3 font-medium">
                      <span className="flex items-center gap-1.5">
                        <Building2 className="size-3.5" /> Setor
                      </span>
                    </th>
                    <th className="text-left pb-3 font-medium">
                      <span className="flex items-center gap-1.5">
                        <User className="size-3.5" /> Coordenador
                      </span>
                    </th>
                    <th className="text-right pb-3 font-medium">
                      <span className="flex items-center justify-end gap-1.5">
                        <Hash className="size-3.5" /> Etiquetas
                      </span>
                    </th>
                    <th className="text-right pb-3 font-medium">
                      <span className="flex items-center justify-end gap-1.5">
                        <CalendarDays className="size-3.5" /> Pedidos
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.rows.map((row, i) => (
                    <tr key={row.id} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                      <td className="py-3 text-muted-foreground text-xs">{i + 1}</td>
                      <td className="py-3 font-medium">{row.name}</td>
                      <td className="py-3 text-muted-foreground">{row.coordinator}</td>
                      <td className="py-3 text-right font-semibold">{row.total.toLocaleString()}</td>
                      <td className="py-3 text-right text-muted-foreground">{row.orders}</td>
                    </tr>
                  ))}
                  <tr className="border-t-2 font-bold">
                    <td colSpan={3} className="py-3 text-sm">Total</td>
                    <td className="py-3 text-right">{data.grandTotal.toLocaleString()}</td>
                    <td className="py-3 text-right">{data.totalOrders}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Print button */}
          <div className="flex justify-end mt-4">
            <Button variant="outline" onClick={handlePrint} className="gap-2">
              <Printer className="size-4" />
              Imprimir
            </Button>
          </div>
        </motion.div>
      )}

      {!data && !isLoading && (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
          <FileText className="size-12 mb-4 opacity-30" />
          <p className="text-sm">Selecione um período e clique em "Gerar Relatório"</p>
        </div>
      )}
    </div>
  );
}
