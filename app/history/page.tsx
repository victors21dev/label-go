import { DataTable } from "../_components/data-table";
import TitleToPage from "../_components/title-page";
import { db } from "../_lib/prisma";
import { historyTableColumns } from "./_components/table-columns";

const History = async () => {
  const dataSector = await db.labelGeneration.findMany();
  return (
    <main className="flex flex-col gap-8">
      <div>
        <TitleToPage
          title="Histórico"
          description="O histórico de todas suas etiquetas geradas"
        />
      </div>
      <div>
        <DataTable columns={historyTableColumns} data={dataSector} />
      </div>
    </main>
  );
};

export default History;
