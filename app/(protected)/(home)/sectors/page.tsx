import { Plus } from "lucide-react";
import { DataTable } from "@/app/_components/data-table";
import TitleToPage from "@/app/_components/title-page";
import { db } from "@/app/_lib/prisma";
import { sectorTableColumns } from "./_components/table-columns";
import InitForm from "@/app/_components/init-form";
import Form from "./_components/form-sector";
import { checkUserStatus } from "@/app/_lib/check-user";
import { redirect } from "next/navigation";

const Sector = async () => {
  const dataSector = await db.sector.findMany();

  const user = await checkUserStatus();

  if (user === "UNAUTHORIZED") {
    redirect("/unauthorized");
  }

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
