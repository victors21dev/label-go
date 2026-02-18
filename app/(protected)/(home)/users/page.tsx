import { DataTable } from "@/app/_components/data-table";
import TitleToPage from "@/app/_components/title-page";
import { userTableColumns } from "./_components/table-columns";
import { db } from "@/app/_lib/prisma";

const Sector = async () => {
  const dataUser = await db.user.findMany();
  return (
    <main className="flex flex-col gap-8">
      <div className="flex justify-between w-full">
        <TitleToPage title="Usuários" description="Acompanhe seus usuários" />
      </div>
      <div>
        <DataTable data={dataUser} columns={userTableColumns} />
      </div>
    </main>
  );
};

export default Sector;
