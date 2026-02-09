import TitleToPage from "../_components/title-page";
import { db } from "../_lib/prisma";
import SelectClient from "../_components/select-client";

const Label = async () => {
  const dataOptionLabelSelect = await db.labelModel.findMany();
  const dataOptionSectorSelect = await db.sector.findMany();

  return (
    <main className="flex flex-col gap-8">
      <div>
        <TitleToPage title="Etiquetas" description="Gere aqui suas etiquetas" />
      </div>
      <div>
        <SelectClient
          dataLabel={dataOptionLabelSelect}
          dataSelect={dataOptionSectorSelect}
        />
      </div>
    </main>
  );
};

export default Label;
