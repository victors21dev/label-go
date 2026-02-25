"use client";

import { ReactNode, useState } from "react";
import { Row } from "@tanstack/react-table";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { updateDataAction } from "@/app/_actions/updates";

type SheetComponentProps = {
  openButton: ReactNode;
  dataTable: Row<any>;
};

export function SheetComponent({ openButton, dataTable }: SheetComponentProps) {
  const data = dataTable.original;
  const [isOpen, setIsOpen] = useState(false);

  // Identifica o tipo baseado nas propriedades do objeto
  const isSector = "coordinatorName" in data;
  const isPrinter = "brand" in data && "model" in data;
  const isLabelModel = "widthMm" in data && "heightMm" in data;

  async function handleSubmit(formData: FormData) {
    let type = isSector ? "sector" : isPrinter ? "printer" : "labelmodel";

    try {
      await updateDataAction(data.id, type, formData);
      toast.success("Dados atualizados com sucesso!");
      setIsOpen(false);
    } catch (error) {
      toast.error("Erro ao atualizar os dados.");
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>{openButton}</SheetTrigger>
      <SheetContent className="sm:max-w-md">
        <form action={handleSubmit} className="flex flex-col h-full">
          <SheetHeader>
            <SheetTitle>
              Editar{" "}
              {isSector
                ? "Setor"
                : isPrinter
                ? "Impressora"
                : "Modelo de Etiqueta"}
            </SheetTitle>
            <SheetDescription>
              Altere os campos abaixo e clique em salvar.
            </SheetDescription>
          </SheetHeader>

          <div className="flex flex-col gap-4 px-4 py-2">
            {/* FORMULÁRIO PARA SETOR */}
            {isSector && (
              <>
                <div className="grid gap-2">
                  <Label htmlFor="name">Nome do Setor</Label>
                  <Input
                    id="name"
                    name="name"
                    defaultValue={data.name}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="coordinatorName">Coordenador</Label>
                  <Input
                    id="coordinatorName"
                    name="coordinatorName"
                    defaultValue={data.coordinatorName}
                    required
                  />
                </div>
              </>
            )}

            {/* FORMULÁRIO PARA IMPRESSORA */}
            {isPrinter && (
              <>
                <div className="grid gap-2">
                  <Label htmlFor="brand">Marca</Label>
                  <Input
                    id="brand"
                    name="brand"
                    defaultValue={data.brand}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="model">Modelo</Label>
                  <Input
                    id="model"
                    name="model"
                    defaultValue={data.model}
                    required
                  />
                </div>
              </>
            )}

            {/* FORMULÁRIO PARA MODELO DE ETIQUETA */}
            {isLabelModel && (
              <>
                <div className="grid gap-2">
                  <Label htmlFor="name">Nome do Modelo</Label>
                  <Input
                    id="name"
                    name="name"
                    defaultValue={data.name}
                    required
                  />
                </div>
                <div className="flex gap-4">
                  <div className="grid gap-2 flex-1">
                    <Label htmlFor="widthMm">Largura (mm)</Label>
                    <Input
                      id="widthMm"
                      name="widthMm"
                      type="number"
                      step="0.1"
                      defaultValue={data.widthMm}
                      required
                    />
                  </div>
                  <div className="grid gap-2 flex-1">
                    <Label htmlFor="heightMm">Altura (mm)</Label>
                    <Input
                      id="heightMm"
                      name="heightMm"
                      type="number"
                      step="0.1"
                      defaultValue={data.heightMm}
                      required
                    />
                  </div>
                </div>
              </>
            )}
          </div>

          <SheetFooter className="mt-auto">
            <Button type="submit">Salvar Informações</Button>
            <SheetClose asChild>
              <Button variant="outline">Cancelar</Button>
            </SheetClose>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
