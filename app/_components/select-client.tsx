"use client";

import { useState } from "react";
import SelectOption from "./select-option";
import LabelRefeicao from "../_label-models/refeicao";
import ContentPrinter from "./content-printer";

type OptionDetails = {
  id: string | number;
  name: string;
  heightMm: number;
  widthMm: number;
};

type SelectClientProps = {
  data: OptionDetails[];
};

const SelectClient = ({ data }: SelectClientProps) => {
  const ModelLabels = [
    {
      name: "Refeição",
      component: <LabelRefeicao />,
    },
  ];

  const [selected, setSelected] = useState("");
  const selectedModelConfig = data.find((model) => model.name === selected);
  const selectedModel = ModelLabels.find((model) => model.name === selected);

  return (
    <div className="flex flex-col gap-2">
      <SelectOption
        title="Modelo da etiqueta"
        dataoption={data}
        onValueChange={setSelected}
      />

      <div className={selected ? "" : "hidden"}>
        <ContentPrinter
          larguraLabelProps={String(selectedModelConfig?.widthMm)}
          alturaLabelProps={String(selectedModelConfig?.heightMm)}
        >
          {selectedModel?.component}
        </ContentPrinter>
      </div>
    </div>
  );
};

export default SelectClient;
