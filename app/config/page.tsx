import { Plus } from "lucide-react";
import { DataTable } from "../_components/data-table";
import TitleToPage from "../_components/title-page";
import { db } from "../_lib/prisma";
import { LabelModelTableColumns } from "./_components/table-columns";
import { Button } from "../_components/ui/button";
import Form from "./_components/form";

const Config = async () => {
  const dataConfig = await db.labelModel.findMany();
  return (
    <main className="flex flex-col gap-8">
      <div className="flex justify-between w-full">
        <TitleToPage
          title="Configuração"
          description="Faça suas configurações aqui"
        />
        <Form />
        <Button>
          <Plus />
          Novo modelo de configuração
        </Button>
      </div>
      <div>
        <DataTable columns={LabelModelTableColumns} data={dataConfig} />
      </div>
    </main>
  );
};

export default Config;
