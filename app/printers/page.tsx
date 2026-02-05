import { DataTable } from "../_components/data-table";
import TitleToPage from "../_components/title-page";
import { db } from "../_lib/prisma";
import { printerTableColumns } from "./_components/table-columns";

const History = async () => {
  const dataSector = await db.printer.findMany();
  return (
    <main>
      <div>
        <TitleToPage
          title="Impressoras"
          description="Configure sua impressora aqui"
        />
      </div>
      <div>
        <DataTable columns={printerTableColumns} data={dataSector} />
      </div>
    </main>
  );
};

export default History;
