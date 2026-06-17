import { Printer } from "lucide-react";
import { DataTable } from "@/app/_components/data-table";
import TitleToPage from "@/app/_components/title-page";
import StatCard from "@/app/_components/stat-card";
import { db } from "@/app/_lib/prisma";
import { printerTableColumns } from "./_components/table-columns";
import InitForm from "@/app/_components/init-form";
import Form from "./_components/form-printer";

const History = async () => {
  const dataSector = await db.printer.findMany();
  const totalPrinters = await db.printer.count();
  const totalGenerations = await db.labelGeneration.count();
  const latestPrinter = await db.printer.findFirst({ orderBy: { createdAt: "desc" } });
  const brandCounts = await db.printer.groupBy({ by: ["brand"], _count: true });
  const topBrand = brandCounts.sort((a, b) => b._count - a._count)[0];

  return (
    <main className="flex flex-col gap-8">
      <TitleToPage
        title="Impressoras"
        description="Configure suas impressoras aqui"
        iconName="Printer"
        iconBg="bg-rose-500/15 text-rose-600 dark:text-rose-400"
      />

      <div className="grid gap-5 grid-cols-2 md:grid-cols-4">
        <StatCard
          title="Total de Impressoras"
          value={totalPrinters}
          description="Cadastradas no sistema"
          iconName="Printer"
          gradient="from-rose-500/20 to-rose-500/5"
          iconBg="bg-rose-500/15 text-rose-600 dark:text-rose-400"
          borderColor="border-l-rose-500"
        />
        <StatCard
          title="Impressões Geradas"
          value={totalGenerations.toLocaleString()}
          description="Total de etiquetas impressas"
          iconName="PrinterCheck"
          gradient="from-emerald-500/20 to-emerald-500/5"
          iconBg="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
          borderColor="border-l-emerald-500"
        />
        <StatCard
          title="Marca Principal"
          value={topBrand?.brand || "—"}
          description={topBrand ? `${topBrand._count} impressoras` : "Nenhuma"}
          iconName="Factory"
          gradient="from-blue-500/20 to-blue-500/5"
          iconBg="bg-blue-500/15 text-blue-600 dark:text-blue-400"
          borderColor="border-l-blue-500"
        />
        <StatCard
          title="Última Adicionada"
          value={latestPrinter?.brand || "—"}
          description={latestPrinter?.model ?? ""}
          iconName="Clock"
          gradient="from-amber-500/20 to-amber-500/5"
          iconBg="bg-amber-500/15 text-amber-600 dark:text-amber-400"
          borderColor="border-l-amber-500"
        />
      </div>

      <div className="flex w-full justify-end">
        <InitForm
          title="Adicionar impressora"
          title_button={
            <>
              <Printer className="h-4 w-4" />
              Adicionar impressora
            </>
          }
        >
          <Form />
        </InitForm>
      </div>
      <DataTable columns={printerTableColumns} data={dataSector} />
    </main>
  );
};

export default History;
