import { Plus } from "lucide-react";
import { DataTable } from "../../_components/data-table";
import TitleToPage from "../../_components/title-page";
import { db } from "../../_lib/prisma";
import { printerTableColumns } from "./_components/table-columns";
import { Button } from "../../_components/ui/button";
import InitForm from "../../_components/init-form";
import Form from "./_components/form-printer";

const History = async () => {
  const dataSector = await db.printer.findMany();
  return (
    <main className="flex flex-col gap-8">
      <div className="flex justify-between w-full">
        <TitleToPage
          title="Impressoras"
          description="Configure sua impressora aqui"
        />
        {/* Button form */}
        <InitForm
          title="Adicionar impressora"
          title_button={
            <>
              <Plus />
              Adicionar impressora
            </>
          }
        >
          <Form />
        </InitForm>
      </div>
      <div>
        <DataTable columns={printerTableColumns} data={dataSector} />
      </div>
    </main>
  );
};

export default History;
