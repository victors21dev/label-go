import { DataTable } from "@/app/_components/data-table";
import TitleToPage from "@/app/_components/title-page";
import { db } from "@/app/_lib/prisma";
import { historyTableColumns } from "./_components/table-columns";
import { checkUserStatus } from "@/app/_lib/check-user";
import { redirect } from "next/navigation";

const History = async () => {
  const dataSector = await db.labelGeneration.findMany();

  const user = await checkUserStatus();

  if (user === "UNAUTHORIZED") {
    redirect("/unauthorized");
  }

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
