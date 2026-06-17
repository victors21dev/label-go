"use client";

import { useState, useRef, useEffect } from "react";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "motion/react";
import SelectOption from "./select-option";
import LabelRefeicao from "../_label-models/refeicao";
import LabelEvento from "../_label-models/evento";
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
import { saveLabels } from "../_actions/labels";

import NextAuth, { DefaultSession } from "next-auth";
import { Role, UserStatus } from "@prisma/client";
import { toast } from "sonner";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: Role;
      status: UserStatus;
    } & DefaultSession["user"];
  }
}

type QueueItem = {
  id: string;
  labelModel: string;
  labelModelId: string;
  mealType: string;
  sector: string;
  sectorId: string;
  dateRangeText: string;
  originalDate: Date;
  quantity: number;
  width: number;
  height: number;
  metadata?: Record<string, string>;
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

const generateId = () => {
  if (typeof window !== "undefined" && window.crypto?.randomUUID) {
    return window.crypto.randomUUID();
  }
  return Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
};

const LabelClient = ({ dataLabel, dataSelect }: SelectClientProps) => {
  const { data: session } = useSession();
  const [selectedMealType, setSelectedMealType] = useState("LUNCH");
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(),
    to: new Date(),
  });
  const [selectedLabel, setSelectedLabel] = useState("");
  const [selectSector, setSelectSector] = useState("");
  const [quantityNumber, setQuantityNumber] = useState("");

  const [eventTitle, setEventTitle] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [eventLocation, setEventLocation] = useState("AABB");
  const [eventDate, setEventDate] = useState("2026-06-19");
  const [eventTime, setEventTime] = useState("");

  const [printQueue, setPrintQueue] = useState<QueueItem[]>([]);

  const selectedModelConfig = dataLabel.find((m) => m.name === selectedLabel);
  const selectedSetorConfig = dataSelect.find((s) => s.name === selectSector);

  const printerRef = useRef<ContentPrinterRef>(null);
  const batchPrinterRef = useRef<ContentPrinterRef>(null);

  useEffect(() => {
    if (selectedLabel === "Evento" && !selectSector && dataSelect.length > 0) {
      setSelectSector(dataSelect[0].name);
    }
  }, [selectedLabel, dataSelect, selectSector]);

  const mealTypeName =
    mealTypeOptions.find(
      (m) => m.id === selectedMealType || m.name === selectedMealType
    )?.name || "Almoço";

  const renderLabelComponent = () => {
    if (!selectedSetorConfig || !dateRange?.from) return null;

    const days = dateRange.to && selectedLabel !== "Evento"
      ? eachDayOfInterval({ start: dateRange.from, end: dateRange.to })
      : [dateRange.from];

    return (
      <div className="flex flex-col gap-4">
        {days.map((day) =>
          selectedLabel === "Evento" ? (
            <LabelEvento
              key={day.toISOString()}
              date={day}
              mealType={mealTypeName}
              dataSector={[selectedSetorConfig]}
              printQtd={Number(quantityNumber)}
              width={selectedModelConfig!.widthMm}
              height={selectedModelConfig!.heightMm}
              eventTitle={eventTitle}
              eventDescription={eventDescription}
              eventLocation={eventLocation}
              eventDate={eventDate}
              eventTime={eventTime}
            />
          ) : (
            <LabelRefeicao
              key={day.toISOString()}
              date={day}
              mealType={mealTypeName}
              dataSector={[selectedSetorConfig]}
              printQtd={Number(quantityNumber)}
              width={selectedModelConfig!.widthMm}
              height={selectedModelConfig!.heightMm}
            />
          )
        )}
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

    const days = dateRange.to
      ? eachDayOfInterval({ start: dateRange.from, end: dateRange.to })
      : [dateRange.from];

    const newItems: QueueItem[] = days.map((day) => ({
      id: generateId(),
      labelModel: selectedLabel,
      labelModelId: String(selectedModelConfig!.id),
      mealType: mealTypeName,
      sector: selectSector,
      sectorId: String(selectedSetorConfig!.id),
      dateRangeText: format(day, "dd/MM/yyyy"),
      originalDate: day,
      quantity: Number(quantityNumber),
      width: selectedModelConfig!.widthMm,
      height: selectedModelConfig!.heightMm,
      metadata:
        selectedLabel === "Evento"
          ? {
              eventTitle,
              eventDescription,
              eventLocation,
              eventDate,
              eventTime,
            }
          : undefined,
    }));

    setPrintQueue((prev) => [...prev, ...newItems]);
  };

  const removeFromQueue = (id: string) => {
    setPrintQueue((prev) => prev.filter((item) => item.id !== id));
  };

  const handleExternalPrint = async () => {
    if (!session?.user?.id) return alert("Usuário não autenticado.");
    if (!selectedSetorConfig || !selectedModelConfig || !dateRange?.from)
      return;

    printerRef.current?.print();

    const days = dateRange.to
      ? eachDayOfInterval({ start: dateRange.from, end: dateRange.to })
      : [dateRange.from];

    const dataToSave = days.map((day) => ({
      userId: session.user.id,
      sectorId: String(selectedSetorConfig.id),
      labelModelId: String(selectedModelConfig.id),
      quantity: Number(quantityNumber),
      date: day,
      metadata:
        selectedLabel === "Evento"
          ? {
              eventTitle,
              eventDescription,
              eventLocation,
              eventDate,
              eventTime,
            }
          : undefined,
    }));

    await saveLabels(dataToSave);
  };

  const handleBatchPrint = async () => {
    if (!session?.user?.id)
      return toast.error(
        "Usuário não autenticado, por favor atualize a página"
      );
    if (printQueue.length === 0) return;

    batchPrinterRef.current?.print();

    const dataToSave = printQueue.map((item) => ({
      userId: session.user.id,
      sectorId: item.sectorId,
      labelModelId: item.labelModelId,
      quantity: item.quantity,
      date: item.originalDate,
      metadata: item.metadata,
    }));

    await saveLabels(dataToSave);
    setPrintQueue([]);
  };

  return (
    <div className="flex gap-2">
      {/* SEÇÃO DE INFORMAÇÕES */}
      <div className="bg-card h-fit p-4 rounded-2xl border-2 grid grid-cols-[auto_auto] gap-4">
        <div className="flex flex-col gap-4 w-62">
          {selectedLabel !== "Evento" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              <h2 className="font-bold">Data</h2>
              <CalendarComponent
                selectedRange={dateRange}
                onRangeChange={setDateRange}
              />
            </motion.div>
          )}
          <SelectOption
            title="Modelo da etiqueta"
            dataoption={dataLabel}
            onValueChange={setSelectedLabel}
          />
          {selectedLabel === "Evento" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="flex flex-col gap-3 p-3 border rounded-xl bg-accent/20 overflow-hidden"
            >
              <span className="text-xs font-bold text-chart-2 uppercase tracking-wider">Dados do Evento</span>
              <InputComponet
                id="event-title"
                title="Título"
                type="text"
                placeholder="Ex: Arraiá dos Amigos"
                onValueChange={setEventTitle}
              />
              <InputComponet
                id="event-description"
                title="Descrição"
                type="text"
                placeholder="Descrição opcional..."
                onValueChange={setEventDescription}
              />
              <InputComponet
                id="event-location"
                title="Local"
                type="text"
                placeholder="Ex: AABB"
                onValueChange={setEventLocation}
              />
              <InputComponet
                id="event-date"
                title="Data do Evento"
                type="date"
                placeholder="Selecione a data"
                onValueChange={setEventDate}
              />
              <InputComponet
                id="event-time"
                title="Horário"
                type="time"
                placeholder="Horário"
                onValueChange={setEventTime}
              />
            </motion.div>
          )}
          {selectedLabel !== "Evento" && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2, delay: 0.05 }}
            >
              <SelectOption
                title="Setor"
                dataoption={dataSelect}
                onValueChange={setSelectSector}
              />
            </motion.div>
          )}
          {selectedLabel !== "Evento" && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2, delay: 0.1 }}
            >
              <SelectOption
                title="Tipo"
                dataoption={mealTypeOptions}
                onValueChange={setSelectedMealType}
              />
            </motion.div>
          )}
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

      {/* SEÇÃO VISUALIZADOR */}
      <div className="flex gap-4 min-w-83.25 h-140 justify-between p-4 border-2 rounded-2xl overflow-hidden">
        <div className="flex flex-col gap-4 flex-1">
          <div className="flex-1 overflow-y-auto w-full scrollbar-thin">
            <AnimatePresence mode="wait">
              {selectedLabel && selectedSetorConfig && selectedModelConfig ? (
                <motion.div
                  key={`${selectedLabel}-${selectSector}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <ContentPrinter
                    ref={printerRef}
                    larguraLabelProps={String(selectedModelConfig.widthMm)}
                    alturaLabelProps={String(selectedModelConfig.heightMm)}
                  >
                    <div>{renderLabelComponent()}</div>
                  </ContentPrinter>
                </motion.div>
              ) : (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-sm text-muted-foreground text-center mt-10"
                >
                  Selecione os dados para <br /> visualizar a etiqueta.
                </motion.p>
              )}
            </AnimatePresence>
          </div>
          <div className="flex gap-2 justify-center">
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Button
                className="bg-chart-4 text-foreground shadow-sm hover:shadow-md transition-shadow"
                onClick={handleExternalPrint}
              >
                <PrinterCheck className="mr-2" size={18} /> Gerar
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Button className="bg-chart-2 shadow-sm hover:shadow-md transition-shadow" onClick={addToQueue}>
                <ListOrdered size={18} className="mr-2" /> Fila
              </Button>
            </motion.div>
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
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setPrintQueue([])}
                className="text-destructive h-8 px-2"
              >
                Limpar
              </Button>
            </motion.div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto overflow-x-hidden space-y-3 pr-1 scrollbar-thin">
          {printQueue.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-muted-foreground text-sm text-center opacity-40">
              <Plus size={40} className="mb-2" />
              <p>
                Adicione etiquetas <br /> para imprimir em lote
              </p>
            </div>
          ) : (
            <AnimatePresence initial={false}>
              {printQueue.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: 50, height: 0 }}
                  animate={{ opacity: 1, x: 0, height: "auto" }}
                  exit={{ opacity: 0, x: 50, height: 0 }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  className="group relative p-3 border rounded-xl bg-accent/30 hover:bg-accent transition-colors border-l-4 border-l-chart-2 w-full box-border overflow-hidden"
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
              </motion.div>
            ))}
          </AnimatePresence>
        )}
        </div>

        <motion.div
          className="mt-4 pt-4 border-t"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button
            className="w-full bg-chart-4 text-foreground font-bold shadow-lg disabled:opacity-50"
            disabled={printQueue.length === 0}
            onClick={handleBatchPrint}
          >
            <Printer size={18} className="mr-2" />
            Imprimir Fila
          </Button>
        </motion.div>
      </div>

      {/* IMPRESSOR DE LOTE OCULTO */}
      <div className="hidden">
        <ContentPrinter
          ref={batchPrinterRef}
          larguraLabelProps="auto"
          alturaLabelProps="auto"
        >
          <div className="flex flex-col gap-0">
            {printQueue.map((item) => {
              const BatchComponent =
                item.labelModel === "Evento" ? LabelEvento : LabelRefeicao;
              return item.labelModel === "Evento" ? (
                <LabelEvento
                  key={item.id}
                  date={item.originalDate}
                  mealType={item.mealType}
                  dataSector={dataSelect.filter((s) => s.name === item.sector)}
                  printQtd={item.quantity}
                  width={item.width}
                  height={item.height}
                  eventTitle={item.metadata?.eventTitle}
                  eventDescription={item.metadata?.eventDescription}
                  eventLocation={item.metadata?.eventLocation}
                  eventDate={item.metadata?.eventDate}
                  eventTime={item.metadata?.eventTime}
                />
              ) : (
                <LabelRefeicao
                  key={item.id}
                  date={item.originalDate}
                  mealType={item.mealType}
                  dataSector={dataSelect.filter((s) => s.name === item.sector)}
                  printQtd={item.quantity}
                  width={item.width}
                  height={item.height}
                />
              );
            })}
          </div>
        </ContentPrinter>
      </div>
    </div>
  );
};

export default LabelClient;
