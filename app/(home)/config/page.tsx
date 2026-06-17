import { Settings } from "lucide-react";
import { DataTable } from "@/app/_components/data-table";
import TitleToPage from "@/app/_components/title-page";
import StatCard from "@/app/_components/stat-card";
import { db } from "@/app/_lib/prisma";
import { LabelModelTableColumns } from "./_components/table-columns";
import Form from "./_components/form-config";
import InitForm from "@/app/_components/init-form";

const Config = async () => {
  const dataConfig = await db.labelModel.findMany();
  const totalModels = await db.labelModel.count();
  const smallestModel = await db.labelModel.findFirst({ orderBy: { heightMm: "asc" } });
  const largestModel = await db.labelModel.findFirst({ orderBy: { heightMm: "desc" } });
  const topModel = await db.labelModel.findFirst({
    orderBy: { labelGenerations: { _count: "desc" } },
    include: { _count: { select: { labelGenerations: true } } },
  });

  return (
    <main className="flex flex-col gap-8">
      <TitleToPage
        title="Configuração"
        description="Gerencie os modelos de etiqueta"
        iconName="Settings"
        iconBg="bg-sky-500/15 text-sky-600 dark:text-sky-400"
      />

      <div className="grid gap-5 grid-cols-2 md:grid-cols-4">
        <StatCard
          title="Modelos de Etiqueta"
          value={totalModels}
          description="Configurados"
          iconName="Tag"
          gradient="from-sky-500/20 to-sky-500/5"
          iconBg="bg-sky-500/15 text-sky-600 dark:text-sky-400"
          borderColor="border-l-sky-500"
        />
        <StatCard
          title="Menor Altura"
          value={smallestModel ? `${smallestModel.heightMm}mm` : "—"}
          description={smallestModel?.name || ""}
          iconName="Ruler"
          gradient="from-emerald-500/20 to-emerald-500/5"
          iconBg="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
          borderColor="border-l-emerald-500"
        />
        <StatCard
          title="Maior Altura"
          value={largestModel ? `${largestModel.heightMm}mm` : "—"}
          description={largestModel?.name || ""}
          iconName="Ruler"
          gradient="from-orange-500/20 to-orange-500/5"
          iconBg="bg-orange-500/15 text-orange-600 dark:text-orange-400"
          borderColor="border-l-orange-500"
        />
        <StatCard
          title="Mais Usado"
          value={topModel?.name || "—"}
          description={topModel ? `${topModel._count.labelGenerations} gerações` : "Nenhum"}
          iconName="Award"
          gradient="from-purple-500/20 to-purple-500/5"
          iconBg="bg-purple-500/15 text-purple-600 dark:text-purple-400"
          borderColor="border-l-purple-500"
        />
      </div>

      <div className="flex w-full justify-end">
        <InitForm
          title="Adicionar configuração"
          title_button={
            <>
              <Settings className="h-4 w-4" />
              Novo modelo
            </>
          }
        >
          <Form />
        </InitForm>
      </div>
      <div>
        <DataTable columns={LabelModelTableColumns} data={dataConfig} />
      </div>
    </main>
  );
};

export default Config;
