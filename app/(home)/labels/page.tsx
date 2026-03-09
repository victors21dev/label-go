import TitleToPage from "@/app/_components/title-page";
import { db } from "@/app/_lib/prisma";
import LabelClient from "@/app/_components/label-client";

const Label = async () => {
  const dataOptionLabelSelect = await db.labelModel.findMany({
    orderBy: {
      name: "asc",
    },
  });
  const dataOptionSectorSelect = await db.sector.findMany({
    orderBy: {
      name: "asc",
    },
  });

  return (
    <main className="flex flex-col gap-8">
      <TitleToPage title="Etiquetas" description="Gere aqui suas etiquetas" />
      <div>
        <LabelClient
          dataLabel={dataOptionLabelSelect}
          dataSelect={dataOptionSectorSelect}
        />
      </div>
    </main>
  );
};

export default Label;
