"use client";

import { useState, useRef } from "react";
import SelectOption from "./select-option";
import LabelRefeicao from "../_label-models/refeicao";
import ContentPrinter, { ContentPrinterRef } from "./content-printer";
import CalendarComponent from "./calendar-component";
import InputComponet from "./input";
import {
  Info,
  ListOrdered,
  Plus,
  PrinterCheck,
  TicketPlus,
} from "lucide-react";
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

  const printerRef = useRef<ContentPrinterRef>(null);
  const handleExternalPrint = () => {
    printerRef.current?.print();
  };

  return (
    <div className="grid grid-cols-[auto_auto_2fr] gap-2">
      {/* INFORMAÇÕES */}
      <div className="bg-card p-4 rounded-2xl border-2 grid grid-cols-[248px_auto] gap-4 h-140">
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
        {/* Vertical */}
        <div className="flex w-8 h-full bg-chart-1 items-center justify-center overflow-hidden">
          <div className="rotate-180 [writing-mode:vertical-lr] flex items-center justify-center gap-2 font-bold text-white whitespace-nowrap">
            <Info size={16} />
            INFORMAÇÕES
          </div>
        </div>
      </div>

      {/* VISUALIZADOR */}
      <div className="flex gap-4 min-w-83.25 h-140 justify-between p-4 border-2 rounded-2xl overflow-hidden">
        <div className="flex flex-col gap-4">
          <div className="flex-1 overflow-y-auto w-full">
            <div className="flex min-w-max">
              <div>
                <div className="flex flex-col gap-4">
                  {selectedLabel &&
                    selectedSetorConfig &&
                    selectedModelConfig && (
                      <ContentPrinter
                        ref={printerRef}
                        larguraLabelProps={String(selectedModelConfig.widthMm)}
                        alturaLabelProps={String(selectedModelConfig.heightMm)}
                      >
                        <div>{renderLabelComponent()}</div>
                      </ContentPrinter>
                    )}
                </div>
              </div>
            </div>
            {!selectedLabel && !selectedSetorConfig && (
              <p className="text-sm text-gray-500">
                Por favor, <br />
                escolha um modelo de etiqueta
              </p>
            )}
            {selectedLabel && !selectedSetorConfig && (
              <p className="text-sm text-gray-500">
                Por favor, <br />
                selecione um setor para <br />
                visualizar a etiqueta.
              </p>
            )}
          </div>
          <div className="flex gap-2 justify-center">
            <Button
              className="bg-chart-4 text-foreground"
              onClick={handleExternalPrint}
            >
              <PrinterCheck />
              Gerar
            </Button>
            <Button className="bg-chart-2">
              <ListOrdered />
              Fila
            </Button>
          </div>
        </div>
        {/*Vertical */}
        <div className="flex w-8 h-full bg-chart-2 items-center justify-center overflow-hidden shrink-0">
          <div className="rotate-180 [writing-mode:vertical-lr] flex items-center justify-center gap-2 font-bold text-card whitespace-nowrap">
            <TicketPlus className="rotate-90" size={16} />
            MODELO ETIQUETA
          </div>
        </div>
      </div>

      {/* GERADOR */}
      <div className="p-4 border-2 rounded-2xl grid grid-rows-[1fr_auto] h-140">
        <div>
          <div className="font-bold">Fila para imprimir(3)</div>
          <div className="text-sm flex flex-col gap-2">
            <div className="p-2 border rounded-lg">
              Refeição | Almoço | Tecnologia da Informação | 06/02/2026 | (12)
            </div>
            <div className="p-2 border rounded-lg">
              Refeição | Almoço | Tecnologia da Informação | 06/02/2026 | (12)
            </div>
            <div className="p-2 border rounded-lg">
              Refeição | Almoço | Tecnologia da Informação | 06/02/2026 | (12)
            </div>
          </div>
        </div>
        <div className="flex w-full justify-end">
          <Button>Gerar as etiquetas</Button>
        </div>
      </div>
    </div>
  );
};

export default LabelClient;
