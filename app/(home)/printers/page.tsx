import { Plus } from "lucide-react";
import { DataTable } from "@/app/_components/data-table";
import TitleToPage from "@/app/_components/title-page";
import { db } from "@/app/_lib/prisma";
import { printerTableColumns } from "./_components/table-columns";
import InitForm from "@/app/_components/init-form";
import Form from "./_components/form-printer";

const History = async () => {
  const dataSector = await db.printer.findMany();

  return (
    <main className="flex flex-col gap-8">
      <TitleToPage
        title="Impressoras"
        description="Configure sua impressora aqui"
      />

      <div className="flex w-full justify-end">
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
      <DataTable columns={printerTableColumns} data={dataSector} />
    </main>
  );
};

export default History;
