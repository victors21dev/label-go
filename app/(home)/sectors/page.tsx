import { Plus } from "lucide-react";
import { DataTable } from "@/app/_components/data-table";
import TitleToPage from "@/app/_components/title-page";
import { db } from "@/app/_lib/prisma";
import { sectorTableColumns } from "./_components/table-columns";
import InitForm from "@/app/_components/init-form";
import Form from "./_components/form-sector";

const Sector = async () => {
  const dataSector = await db.sector.findMany();

  return (
    <main className="flex flex-col gap-8">
      <TitleToPage
        title="Setores"
        description="Registre seus setores nessa aba"
      />
      {/* Button form */}

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
      <DataTable data={dataSector} columns={sectorTableColumns} />
    </main>
  );
};

export default Sector;
