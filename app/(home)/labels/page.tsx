import TitleToPage from "../../_components/title-page";
import { db } from "../../_lib/prisma";
import LabelClient from "../../_components/label-client";
import Header from "../../_components/header";

const Label = async () => {
  const dataOptionLabelSelect = await db.labelModel.findMany();
  const dataOptionSectorSelect = await db.sector.findMany();

  return (
    <main className="flex flex-col gap-8">
      <Header>
        <TitleToPage title="Etiquetas" description="Gere aqui suas etiquetas" />
      </Header>
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
