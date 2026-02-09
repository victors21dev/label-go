import TitleToPage from "../_components/title-page";
import SelectOption from "../_components/select-option";
import { db } from "../_lib/prisma";
import LabelRefeicao from "../_label-models/refeicao";
import ContentPrinter from "../_components/content-printer";
import SelectClient from "../_components/select-client";

const Label = async () => {
  const dataOptionLabelSelect = await db.labelModel.findMany();
  const dataOptionSectorSelect = await db.sector.findMany();

  return (
    <main className="flex flex-col gap-8">
      <div>
        <TitleToPage title="Etiquetas" description="Gere aqui suas etiquetas" />
      </div>
      {/* Opção Setor */}
      <div className="flex flex-col gap-4">
        {/* <SelectOption title="Setor" dataoption={dataOptionSectorSelect} /> */}
      </div>
      <div>
        <SelectClient data={dataOptionLabelSelect} />
      </div>
    </main>
  );
};

export default Label;
