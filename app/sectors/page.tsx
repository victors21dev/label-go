import { Plus } from "lucide-react";
import { DataTable } from "../_components/data-table";
import TitleToPage from "../_components/title-page";
import { Button } from "../_components/ui/button";
import { db } from "../_lib/prisma";
import { sectorTableColumns } from "./_components/table-columns";
import InitForm from "../_components/init-form";
import Form from "./_components/form-sector";

const Sector = async () => {
  const dataSector = await db.sector.findMany();
  return (
    <main className="flex flex-col gap-8">
      <div className="flex justify-between w-full">
        <TitleToPage
          title="Setores"
          description="Registre seus setores nessa aba"
        />
        {/* Button form */}
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
        <DataTable data={dataSector} columns={sectorTableColumns} />
      </div>
    </main>
  );
};

export default Sector;
