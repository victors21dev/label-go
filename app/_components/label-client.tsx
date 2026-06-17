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
  CalendarDays,
  Building2,
  Tag,
  Hash,
} from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
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
      toast.error("Preencha todos os campos antes de adicionar à fila!");
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
    if (!session?.user?.id) return toast.error("Usuário não autenticado.");
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
    toast.success("Fila impressa com sucesso!");
    setPrintQueue([]);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* TOP ROW: INFO + VISUALIZER */}
      <div className="grid lg:grid-cols-[1fr_auto] gap-6">
        {/* INFORMAÇÕES */}
        <div className="bg-card border rounded-xl p-5 min-w-0">
          <div className="flex items-center gap-3 pb-3 border-b mb-4">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <Info className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-semibold text-sm">Informações da Etiqueta</h3>
              <p className="text-xs text-muted-foreground">
                Preencha os dados para gerar
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-5 overflow-hidden">
            {/* DATA - lado esquerdo */}
            {selectedLabel !== "Evento" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
                className="shrink-0"
              >
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                  <CalendarDays className="h-3.5 w-3.5 inline mr-1" />
                  Período
                </label>
                <CalendarComponent
                  selectedRange={dateRange}
                  onRangeChange={setDateRange}
                />
              </motion.div>
            )}

            {/* FORMULÁRIO - lado direito */}
            <div className="flex-1 min-w-0 space-y-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                  <Tag className="h-3.5 w-3.5 inline mr-1" />
                  Modelo da etiqueta
                </label>
                <SelectOption
                  title=""
                  dataoption={dataLabel}
                  onValueChange={setSelectedLabel}
                />
              </div>

              {selectedLabel === "Evento" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="border rounded-lg p-3 bg-accent/10 space-y-2.5"
                >
                  <span className="text-xs font-semibold text-chart-2 uppercase tracking-wider flex items-center gap-1.5">
                    <TicketPlus className="h-3.5 w-3.5" />
                    Dados do Evento
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
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
                  </div>
                </motion.div>
              )}

              {selectedLabel !== "Evento" && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: 0.05 }}
                >
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                    <Building2 className="h-3.5 w-3.5 inline mr-1" />
                    Setor
                  </label>
                  <SelectOption
                    title=""
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
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                    <ListOrdered className="h-3.5 w-3.5 inline mr-1" />
                    Tipo
                  </label>
                  <SelectOption
                    title=""
                    dataoption={mealTypeOptions}
                    onValueChange={setSelectedMealType}
                  />
                </motion.div>
              )}

              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                  <Hash className="h-3.5 w-3.5 inline mr-1" />
                  Quantidade
                </label>
                <InputComponet
                  id="1"
                  title=""
                  type="number"
                  placeholder="Digite a quantidade..."
                  onValueChange={setQuantityNumber}
                  min={1}
                />
              </div>
            </div>
          </div>
        </div>

        {/* VISUALIZADOR */}
        <div className="bg-card border rounded-xl p-5 flex flex-col min-h-[400px] max-h-[600px]">
          <div className="flex items-center gap-3 pb-3 border-b mb-4">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <TicketPlus className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-semibold text-sm">Visualizador</h3>
              <p className="text-xs text-muted-foreground">
                Pré-visualização da etiqueta
              </p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto scrollbar-thin min-h-[200px] max-h-[500px] flex flex-col">
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
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center gap-2 text-muted-foreground flex-1"
                >
                  <TicketPlus className="h-10 w-10 opacity-20" />
                  <p className="text-sm text-center">
                    Selecione os dados para visualizar a etiqueta
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex gap-3 justify-center pt-4 border-t mt-4">
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Button
                className="gap-2 bg-gradient-to-r from-cyan-600 to-teal-500 hover:from-cyan-500 hover:to-teal-400 text-white shadow-sm"
                disabled={!selectedModelConfig || !selectedSetorConfig || !quantityNumber}
                onClick={handleExternalPrint}
              >
                <PrinterCheck className="h-4 w-4" /> Gerar
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Button
                variant="secondary"
                className="gap-2 border-violet-200 dark:border-violet-800 text-violet-700 dark:text-violet-300 hover:bg-violet-50 dark:hover:bg-violet-950"
                disabled={!selectedModelConfig || !selectedSetorConfig || !quantityNumber}
                onClick={addToQueue}
              >
                <ListOrdered className="h-4 w-4" /> Fila
              </Button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* FILA DE IMPRESSÃO - abaixo */}
      <div className="bg-card border rounded-xl p-5">
        <div className="flex items-center justify-between pb-3 border-b mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-chart-2/10 text-chart-2">
              <ListOrdered className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-semibold text-sm">Fila de Impressão</h3>
              <p className="text-xs text-muted-foreground">
                {printQueue.length} {printQueue.length === 1 ? "item" : "itens"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {printQueue.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setPrintQueue([])}
                className="text-destructive h-8 px-2 text-xs"
              >
                Limpar
              </Button>
            )}
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                className="gap-2 bg-gradient-to-r from-emerald-600 to-green-500 hover:from-emerald-500 hover:to-green-400 text-white shadow-sm"
                disabled={printQueue.length === 0}
                onClick={handleBatchPrint}
              >
                <Printer className="h-4 w-4" />
                Imprimir ({printQueue.length})
              </Button>
            </motion.div>
          </div>
        </div>

        <div className="overflow-y-auto max-h-60 space-y-2 pr-1 scrollbar-thin">
          {printQueue.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-muted-foreground text-center gap-2 py-8">
              <Plus className="h-8 w-8 opacity-20" />
              <p className="text-sm">Adicione etiquetas para imprimir em lote</p>
            </div>
          ) : (
            <AnimatePresence initial={false}>
              {printQueue.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 30 }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  className="group relative p-3 rounded-lg border bg-accent/20 hover:bg-accent/40 transition-colors"
                >
                  <button
                    onClick={() => removeFromQueue(item.id)}
                    className="absolute -top-1.5 -right-1.5 bg-destructive text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-md z-10"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-5 font-semibold text-chart-2 border-chart-2/30">
                        {item.labelModel}
                      </Badge>
                      <p className="text-xs font-medium mt-1.5 truncate">
                        {item.sector}
                      </p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">
                        {item.mealType} — {item.dateRangeText}
                      </p>
                    </div>
                    <Badge className="shrink-0 text-xs font-mono">
                      {item.quantity}
                    </Badge>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
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
            {printQueue.map((item) => {
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
