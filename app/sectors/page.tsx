import { DataTable } from "../_components/data-table";
import TitleToPage from "../_components/title-page";
import { db } from "../_lib/prisma";
import { sectorTableColumns } from "./_components/table-columns";

const Sector = async () => {
  const dataSector = await db.sector.findMany();
  return (
    <main className="flex flex-col gap-8">
      <div>
        <TitleToPage
          title="Setores"
          description="Registre seus setores nessa aba"
        />
      </div>
      <div>
        <DataTable data={dataSector} columns={sectorTableColumns} />
      </div>
    </main>
  );
};

export default Sector;
