import { Table } from "lucide-react";
import { DataTable } from "@/app/_components/data-table";
import TitleToPage from "@/app/_components/title-page";
import StatCard from "@/app/_components/stat-card";
import { db } from "@/app/_lib/prisma";
import { sectorTableColumns } from "./_components/table-columns";
import InitForm from "@/app/_components/init-form";
import Form from "./_components/form-sector";

const Sector = async () => {
  const dataSector = await db.sector.findMany();
  const totalSectors = await db.sector.count();
  const totalCoordinators = (await db.sector.findMany({ select: { coordinatorName: true } }))
    .filter((s, i, arr) => arr.findIndex((x) => x.coordinatorName === s.coordinatorName) === i).length;
  const totalUsersInSectors = await db.user.count({ where: { sectorId: { not: null } } });
  const totalGenerations = await db.labelGeneration.count();

  return (
    <main className="flex flex-col gap-8">
      <TitleToPage
        title="Setores"
        description="Registre e gerencie seus setores"
        iconName="Table"
        iconBg="bg-cyan-500/15 text-cyan-600 dark:text-cyan-400"
      />

      <div className="grid gap-5 grid-cols-2 md:grid-cols-4">
        <StatCard
          title="Total de Setores"
          value={totalSectors}
          description="Cadastrados"
          iconName="Layers"
          gradient="from-cyan-500/20 to-cyan-500/5"
          iconBg="bg-cyan-500/15 text-cyan-600 dark:text-cyan-400"
          borderColor="border-l-cyan-500"
        />
        <StatCard
          title="Coordenadores"
          value={totalCoordinators}
          description="Coordenadores distintos"
          iconName="UserCircle"
          gradient="from-amber-500/20 to-amber-500/5"
          iconBg="bg-amber-500/15 text-amber-600 dark:text-amber-400"
          borderColor="border-l-amber-500"
        />
        <StatCard
          title="Usuários Alocados"
          value={totalUsersInSectors}
          description="Vinculados a setores"
          iconName="Users"
          gradient="from-blue-500/20 to-blue-500/5"
          iconBg="bg-blue-500/15 text-blue-600 dark:text-blue-400"
          borderColor="border-l-blue-500"
        />
        <StatCard
          title="Impressões Geradas"
          value={totalGenerations.toLocaleString()}
          description="Total nos setores"
          iconName="Layers"
          gradient="from-emerald-500/20 to-emerald-500/5"
          iconBg="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
          borderColor="border-l-emerald-500"
        />
      </div>

      <div className="flex w-full justify-end">
        <InitForm
          title="Adicionar setor"
          title_button={
            <>
              <Table className="h-4 w-4" />
              Adicionar setor
            </>
          }
        >
          <Form />
        </InitForm>
      </div>
      <DataTable data={dataSector} columns={sectorTableColumns} />
    </main>
  );
};

export default Sector;
