import { Plus } from "lucide-react";
import { DataTable } from "@/app/_components/data-table";
import TitleToPage from "@/app/_components/title-page";
import { db } from "@/app/_lib/prisma";
import { LabelModelTableColumns } from "./_components/table-columns";
import Form from "./_components/form-config";
import InitForm from "@/app/_components/init-form";

const Config = async () => {
  const dataConfig = await db.labelModel.findMany();

  return (
    <main className="flex flex-col gap-8">
      <TitleToPage
        title="Configuração"
        description="Faça suas configurações aqui"
      />
      <div className="flex w-full justify-end">
        <InitForm
          title="Adicionar configuração"
          title_button={
            <>
              <Plus />
              Novo modelo de configuração
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
