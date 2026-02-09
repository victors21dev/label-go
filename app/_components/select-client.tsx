"use client";

import { useState } from "react";
import SelectOption from "./select-option";
import LabelRefeicao from "../_label-models/refeicao";
import ContentPrinter from "./content-printer";
import CalendarComponent from "./calendar-component";

type OptionLabelDetails = {
  id: string | number;
  name: string;
  heightMm: number;
  widthMm: number;
};

type OptionSelectDetails = {
  id: string | number;
  name: string;
  coordinatorName: string;
};

type SelectClientProps = {
  dataLabel: OptionLabelDetails[];
  dataSelect: OptionSelectDetails[];
};

const SelectClient = ({ dataLabel, dataSelect }: SelectClientProps) => {
  const [selectedLabel, setSelectedLabel] = useState("");
  const [selectSector, setSelectSector] = useState("");

  const selectedModelConfig = dataLabel.find((m) => m.name === selectedLabel);
  const selectedSetorConfig = dataSelect.find((s) => s.name === selectSector);

  const renderLabelComponent = () => {
    if (!selectedSetorConfig) return null;

    switch (selectedLabel) {
      case "Refeição":
        return <LabelRefeicao dataSector={[selectedSetorConfig]} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-4">
        <div>
          <CalendarComponent />
        </div>
        <div className="flex flex-col gap-4">
          <SelectOption
            title="Modelo da etiqueta"
            dataoption={dataLabel}
            onValueChange={setSelectedLabel}
          />
          <SelectOption
            title="Setor"
            dataoption={dataSelect}
            onValueChange={setSelectSector}
          />
        </div>
      </div>

      {selectedLabel && selectedSetorConfig && selectedModelConfig && (
        <ContentPrinter
          larguraLabelProps={String(selectedModelConfig.widthMm)}
          alturaLabelProps={String(selectedModelConfig.heightMm)}
        >
          {renderLabelComponent()}
        </ContentPrinter>
      )}

      {selectedLabel && !selectedSetorConfig && (
        <p className="text-sm text-gray-500">
          Por favor, selecione um setor para visualizar a etiqueta.
        </p>
      )}
    </div>
  );
};

export default SelectClient;
