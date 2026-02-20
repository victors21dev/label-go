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
  PrinterCheck,
  TicketPlus,
  Trash2,
  Printer,
  Plus,
} from "lucide-react";
import { Button } from "./ui/button";
import { eachDayOfInterval, format } from "date-fns";
import { DateRange } from "react-day-picker";

type QueueItem = {
  id: string;
  labelModel: string;
  mealType: string;
  sector: string;
  dateRangeText: string;
  originalDate: Date; // Armazena a data real para o QR Code
  quantity: number;
  width: number;
  height: number;
};

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

const mealTypeOptions = [
  { id: "BREAKFAST", name: "Café da Manhã" },
  { id: "LUNCH", name: "Almoço" },
  { id: "DINNER", name: "Jantar" },
];

const LabelClient = ({ dataLabel, dataSelect }: SelectClientProps) => {
  const [selectedMealType, setSelectedMealType] = useState("LUNCH");
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(),
    to: new Date(),
  });
  const [selectedLabel, setSelectedLabel] = useState("");
  const [selectSector, setSelectSector] = useState("");
  const [quantityNumber, setQuantityNumber] = useState("");
  const [printQueue, setPrintQueue] = useState<QueueItem[]>([]);

  const selectedModelConfig = dataLabel.find((m) => m.name === selectedLabel);
  const selectedSetorConfig = dataSelect.find((s) => s.name === selectSector);

  const printerRef = useRef<ContentPrinterRef>(null);
  const batchPrinterRef = useRef<ContentPrinterRef>(null);

  const mealTypeName =
    mealTypeOptions.find(
      (m) => m.id === selectedMealType || m.name === selectedMealType
    )?.name || "Almoço";

  const renderLabelComponent = () => {
    if (!selectedSetorConfig || !dateRange?.from) return null;

    const days = dateRange.to
      ? eachDayOfInterval({ start: dateRange.from, end: dateRange.to })
      : [dateRange.from];

    return (
      <div className="flex flex-col gap-4">
        {days.map((day) => (
          <LabelRefeicao
            key={day.toISOString()}
            date={day}
            mealType={mealTypeName}
            dataSector={selectedSetorConfig ? [selectedSetorConfig] : []}
            printQtd={Number(quantityNumber)}
            width={selectedModelConfig!.widthMm}
            height={selectedModelConfig!.heightMm}
          />
        ))}
      </div>
    );
  };

  const addToQueue = () => {
    if (
      !selectedLabel ||
      !selectedSetorConfig ||
      !quantityNumber ||
      !dateRange?.from
    ) {
      alert("Preencha todos os campos antes de adicionar à fila!");
      return;
    }

    const dateText = dateRange.to
      ? `${format(dateRange.from, "dd/MM")} - ${format(
          dateRange.to,
          "dd/MM/yyyy"
        )}`
      : format(dateRange.from, "dd/MM/yyyy");

    const newItem: QueueItem = {
      id: crypto.randomUUID(),
      labelModel: selectedLabel,
      mealType: mealTypeName,
      sector: selectSector,
      dateRangeText: dateText,
      originalDate: dateRange.from,
      quantity: Number(quantityNumber),
      width: selectedModelConfig!.widthMm,
      height: selectedModelConfig!.heightMm,
    };

    setPrintQueue((prev) => [...prev, newItem]);
  };

  const removeFromQueue = (id: string) => {
    setPrintQueue((prev) => prev.filter((item) => item.id !== id));
  };

  const handleExternalPrint = () => {
    printerRef.current?.print();
  };

  const handleBatchPrint = () => {
    if (printQueue.length === 0) return;
    batchPrinterRef.current?.print();
  };

  return (
    <div className="flex gap-2">
      {/* INFORMAÇÕES */}
      <div className="bg-card h-fit p-4 rounded-2xl border-2 grid grid-cols-[auto_auto] gap-4">
        <div className="flex flex-col gap-4 w-62">
          <div>
            <h2 className="font-bold">Data</h2>
            <CalendarComponent
              selectedRange={dateRange}
              onRangeChange={setDateRange}
            />
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
          <SelectOption
            title="Tipo"
            dataoption={mealTypeOptions}
            onValueChange={setSelectedMealType}
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
        <div className="flex w-8 h-full bg-chart-1 items-center justify-center overflow-hidden rounded-lg">
          <div className="rotate-180 [writing-mode:vertical-lr] flex items-center justify-center gap-2 font-bold text-white whitespace-nowrap text-xs">
            <Info size={16} />
            INFORMAÇÕES
          </div>
        </div>
      </div>
      {/* VISUALIZADOR */}
      <div className="flex gap-4 min-w-83.25 h-140 justify-between p-4 border-2 rounded-2xl overflow-hidden">
        <div className="flex flex-col gap-4 flex-1">
          <div className="flex-1 overflow-y-auto w-full">
            <div className="flex flex-col gap-4">
              {selectedLabel && selectedSetorConfig && selectedModelConfig ? (
                <ContentPrinter
                  ref={printerRef}
                  larguraLabelProps={String(selectedModelConfig.widthMm)}
                  alturaLabelProps={String(selectedModelConfig.heightMm)}
                >
                  <div>{renderLabelComponent()}</div>
                </ContentPrinter>
              ) : (
                <p className="text-sm text-gray-500 text-center mt-10">
                  Selecione os dados para <br /> visualizar a etiqueta.
                </p>
              )}
            </div>
          </div>
          <div className="flex gap-2 justify-center">
            <Button
              className="bg-chart-4 text-foreground"
              onClick={handleExternalPrint}
            >
              <PrinterCheck className="mr-2" size={18} /> Gerar
            </Button>
            <Button className="bg-chart-2" onClick={addToQueue}>
              <ListOrdered size={18} className="mr-2" /> Fila
            </Button>
          </div>
        </div>
        <div className="flex w-8 h-full bg-chart-2 items-center justify-center overflow-hidden shrink-0 rounded-lg">
          <div className="rotate-180 [writing-mode:vertical-lr] flex items-center justify-center gap-2 font-bold text-card whitespace-nowrap uppercase text-xs">
            <TicketPlus className="rotate-90" size={16} />
            Visualizador
          </div>
        </div>
      </div>
      {/* FILA DE IMPRESSÃO */}
      <div className="bg-card p-4 border-2 rounded-2xl flex flex-col w-full h-140 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between mb-4 border-b pb-2">
          <h2 className="font-bold flex items-center gap-2">
            <ListOrdered size={20} className="text-chart-2" />
            Fila ({printQueue.length})
          </h2>
          {printQueue.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setPrintQueue([])}
              className="text-destructive h-8 px-2"
            >
              Limpar
            </Button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto overflow-x-hidden space-y-3 pr-1 custom-scrollbar">
          {printQueue.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-muted-foreground text-sm text-center opacity-40">
              <Plus size={40} className="mb-2" />
              <p>
                Adicione etiquetas <br /> para imprimir em lote
              </p>
            </div>
          ) : (
            printQueue.map((item) => (
              <div
                key={item.id}
                className="group relative p-3 border rounded-xl bg-accent/30 hover:bg-accent transition-colors border-l-4 border-l-chart-2 w-full box-border"
              >
                <button
                  onClick={() => removeFromQueue(item.id)}
                  className="absolute right-2 top-2 bg-destructive text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-md z-10"
                >
                  <Trash2 size={12} />
                </button>

                <div className="text-[10px] font-bold text-chart-2 uppercase truncate">
                  {item.labelModel} • {item.mealType}
                </div>

                <div className="text-xs font-semibold truncate mt-1 pr-2">
                  {item.sector}
                </div>

                <div className="flex justify-between items-center mt-2 text-[10px] text-muted-foreground gap-1">
                  <span className="truncate">{item.dateRangeText}</span>
                  <span className="font-bold bg-chart-2/10 text-chart-2 px-2 py-0.5 rounded-full shrink-0">
                    {item.quantity} un
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="mt-4 pt-4 border-t">
          <Button
            className="w-full bg-chart-4 text-foreground font-bold shadow-lg disabled:opacity-50"
            disabled={printQueue.length === 0}
            onClick={handleBatchPrint}
          >
            <Printer size={18} className="mr-2" />
            Imprimir Fila
          </Button>
        </div>
      </div>
      {/* IMPRESSOR DE LOTE OCULTO */}
      <div className="hidden">
        <ContentPrinter
          ref={batchPrinterRef}
          larguraLabelProps="auto"
          alturaLabelProps="auto"
        >
          <div className="flex flex-col gap-0">
            {printQueue.map((item) => (
              <LabelRefeicao
                key={item.id}
                date={item.originalDate}
                mealType={item.mealType}
                dataSector={dataSelect.filter((s) => s.name === item.sector)}
                printQtd={item.quantity}
                width={item.width}
                height={item.height}
              />
            ))}
          </div>
        </ContentPrinter>
      </div>
    </div>
  );
};

export default LabelClient;
