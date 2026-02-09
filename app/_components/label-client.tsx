"use client";

import { useState } from "react";
import SelectOption from "./select-option";
import LabelRefeicao from "../_label-models/refeicao";
import ContentPrinter from "./content-printer";
import CalendarComponent from "./calendar-component";
import InputComponet from "./input";
import { Info, TicketPlus, View } from "lucide-react";
import { Button } from "./ui/button";

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

const LabelClient = ({ dataLabel, dataSelect }: SelectClientProps) => {
  const [selectedLabel, setSelectedLabel] = useState("");
  const [selectSector, setSelectSector] = useState("");
  const [quantityNumber, setQuantityNumber] = useState("");

  const selectedModelConfig = dataLabel.find((m) => m.name === selectedLabel);
  const selectedSetorConfig = dataSelect.find((s) => s.name === selectSector);

  console.log(selectedModelConfig);

  const renderLabelComponent = () => {
    if (!selectedSetorConfig) return null;

    switch (selectedLabel) {
      case "Refeição": {
        return (
          selectedModelConfig && (
            <LabelRefeicao
              dataSector={selectedSetorConfig ? [selectedSetorConfig] : []}
              printQtd={Number(quantityNumber)}
              width={selectedModelConfig.widthMm}
              height={selectedModelConfig.heightMm}
            />
          )
        );
      }
      default:
        return null;
    }
  };

  return (
    <div className="grid grid-cols-[auto_auto_2fr] gap-2">
      {/* INFORMAÇÕES */}
      <div className="bg-card p-4 rounded-2xl border-2 grid grid-cols-[248px_auto] gap-2 h-140">
        {/* Card */}
        <div className="flex flex-col gap-4 w-62">
          <div>
            <h2 className="font-bold">Data</h2>
            <CalendarComponent />
          </div>
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
          <InputComponet
            id="1"
            title="Quantidade"
            type="number"
            placeholder="Digite a quantidade..."
            onValueChange={setQuantityNumber}
            min={1}
          />
        </div>
        {/* Texto Vertical */}
        <div className="flex w-8 h-full bg-chart-1 items-center justify-center overflow-hidden">
          <div className="rotate-180 [writing-mode:vertical-lr] flex items-center justify-center gap-2 font-bold text-white whitespace-nowrap">
            <Info size={16} />
            INFORMAÇÕES
          </div>
        </div>
      </div>
      {/* VISUALIZADOR */}
      <div className="flex gap-4 min-w-79.5 h-140 justify-between p-4 border-2 rounded-2xl overflow-hidden">
        <div className="flex flex-col gap-4">
          <div className="flex-1 overflow-y-auto w-full">
            <div className="flex min-w-max">
              <div>
                {selectedLabel &&
                  selectedSetorConfig &&
                  selectedModelConfig && (
                    <ContentPrinter
                      larguraLabelProps={String(selectedModelConfig.widthMm)}
                      alturaLabelProps={String(selectedModelConfig.heightMm)}
                    >
                      {renderLabelComponent()}
                    </ContentPrinter>
                  )}
              </div>
            </div>
            {!selectedLabel && !selectedSetorConfig && (
              <p className="text-sm text-gray-500">
                Por favor, escolha um modelo de etiqueta
              </p>
            )}
            {selectedLabel && !selectedSetorConfig && (
              <p className="text-sm text-gray-500">
                Por favor, selecione um setor para visualizar a etiqueta.
              </p>
            )}
          </div>
          <div>
            <Button>Aqui</Button>
          </div>
        </div>
        {/* Texto Vertical (Fixo à direita) */}
        <div className="flex w-8 h-full bg-chart-2 items-center justify-center overflow-hidden shrink-0">
          <div className="rotate-180 [writing-mode:vertical-lr] flex items-center justify-center gap-2 font-bold text-card whitespace-nowrap">
            <TicketPlus className="rotate-90" size={16} />
            MODELO ETIQUETA
          </div>
        </div>
      </div>
      {/* GERADOR */}
      <div className="bg-secondary rounded-2xl p-6 grid grid-rows-[1fr_auto] h-140">
        <div>Content</div>
        <div className="flex w-full justify-end">
          <Button>Gerar as etiquetas</Button>
        </div>
      </div>
    </div>
  );
};

export default LabelClient;
