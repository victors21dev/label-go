import TitleToPage from "@/app/_components/title-page";
import { db } from "@/app/_lib/prisma";
import LabelClient from "@/app/_components/label-client";
import Header from "@/app/_components/header";
import { handleGenerateLink } from "@/app/_actions/generate-link";

const Label = async () => {
  const dataOptionLabelSelect = await db.labelModel.findMany();
  const dataOptionSectorSelect = await db.sector.findMany();

  const result = await handleGenerateLink({
    setor: "T.I.",
    coordenador: "Lira",
    validade: "19/02/2026",
    tipo: "Almoço",
  });

  return (
    <main className="flex flex-col gap-8">
      <Header>
        <TitleToPage title="Etiquetas" description="Gere aqui suas etiquetas" />
      </Header>
      <div>
        <LabelClient
          dataLabel={dataOptionLabelSelect}
          dataSelect={dataOptionSectorSelect}
          dataQr={result}
        />
      </div>
    </main>
  );
};

export default Label;
