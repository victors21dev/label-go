import { DataTable } from "@/app/_components/data-table";
import TitleToPage from "@/app/_components/title-page";
import StatCard from "@/app/_components/stat-card";
import { userTableColumns } from "./_components/table-columns";
import { db } from "@/app/_lib/prisma";

const Sector = async () => {
  const dataUser = await db.user.findMany();
  const totalUsers = await db.user.count();
  const adminCount = await db.user.count({ where: { role: "ADMIN" } });
  const userCount = await db.user.count({ where: { role: "USER" } });
  const authorizedCount = await db.user.count({ where: { status: "AUTHORIZED" } });
  const unauthorizedCount = await db.user.count({ where: { status: "UNAUTHORIZED" } });

  return (
    <main className="flex flex-col gap-8">
      <TitleToPage
        title="Usuários"
        description="Acompanhe seus usuários"
        iconName="Users"
        iconBg="bg-violet-500/15 text-violet-600 dark:text-violet-400"
      />

      <div className="grid gap-5 grid-cols-2 md:grid-cols-4">
        <StatCard
          title="Total de Usuários"
          value={totalUsers}
          description="Cadastrados no sistema"
          iconName="Users"
          gradient="from-violet-500/20 to-violet-500/5"
          iconBg="bg-violet-500/15 text-violet-600 dark:text-violet-400"
          borderColor="border-l-violet-500"
        />
        <StatCard
          title="Administradores"
          value={adminCount}
          description="Com acesso total"
          iconName="Shield"
          gradient="from-amber-500/20 to-amber-500/5"
          iconBg="bg-amber-500/15 text-amber-600 dark:text-amber-400"
          borderColor="border-l-amber-500"
        />
        <StatCard
          title="Usuários Comuns"
          value={userCount}
          description="Acesso limitado"
          iconName="UserCheck"
          gradient="from-blue-500/20 to-blue-500/5"
          iconBg="bg-blue-500/15 text-blue-600 dark:text-blue-400"
          borderColor="border-l-blue-500"
        />
        <StatCard
          title="Pendentes"
          value={unauthorizedCount}
          description={`${authorizedCount} autorizados`}
          iconName="UserX"
          gradient="from-rose-500/20 to-rose-500/5"
          iconBg="bg-rose-500/15 text-rose-600 dark:text-rose-400"
          borderColor="border-l-rose-500"
        />
      </div>

      <div>
        <DataTable data={dataUser} columns={userTableColumns} />
      </div>
    </main>
  );
};

export default Sector;
