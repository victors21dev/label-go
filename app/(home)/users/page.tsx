import { DataTable } from "../../_components/data-table";
import TitleToPage from "../../_components/title-page";
import { userTableColumns } from "./_components/table-columns";
import { db } from "../../_lib/prisma";
import { Button } from "../../_components/ui/button";
import { Plus } from "lucide-react";

const Sector = async () => {
  const dataUser = await db.user.findMany();
  return (
    <main className="flex flex-col gap-8">
      <div className="flex justify-between w-full">
        <TitleToPage title="Usuários" description="Acompanhe seus usuários" />
        <Button>
          <Plus />
          Adicionar novo usuário
        </Button>
      </div>
      <div>
        <DataTable data={dataUser} columns={userTableColumns} />
      </div>
    </main>
  );
};

export default Sector;
