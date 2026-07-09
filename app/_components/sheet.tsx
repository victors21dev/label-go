"use client";

import { ReactNode, useEffect, useState } from "react";
import { Row } from "@tanstack/react-table";
import { toast } from "sonner";
import { SearchableSelect } from "@/app/_components/ui/searchable-select";
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
import { updateDataAction, getSectors } from "@/app/_actions/updates";

export function SheetComponent({
  openButton,
  dataTable,
}: {
  openButton: ReactNode;
  dataTable: Row<any>;
}) {
  const data = dataTable.original;
  const [isOpen, setIsOpen] = useState(false);
  const [sectors, setSectors] = useState<{ id: string; name: string }[]>([]);

  // Verificadores de Tipo de Dado
  const isUser = "username" in data && "role" in data;
  const isSector = "coordinatorName" in data && !isUser;
  const isPrinter = "brand" in data && "model" in data;
  const isLabelModel = "widthMm" in data && "heightMm" in data;

  useEffect(() => {
    if (isUser && isOpen) {
      getSectors().then(setSectors);
    }
  }, [isUser, isOpen]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    let type = "other";
    if (isUser) type = "user";
    else if (isSector) type = "sector";
    else if (isPrinter) type = "printer";
    else if (isLabelModel) type = "labelmodel";

    try {
      await updateDataAction(data.id, type, formData);
      toast.success("Atualizado com sucesso!");
      setIsOpen(false);
    } catch (error) {
      toast.error("Erro na atualização.");
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>{openButton}</SheetTrigger>
      <SheetContent className="sm:max-w-md overflow-y-auto">
        <form onSubmit={handleSubmit} className="flex flex-col h-full gap-4">
          <SheetHeader>
            <SheetTitle>
              Editar{" "}
              {isUser
                ? "Usuário"
                : isSector
                ? "Setor"
                : isPrinter
                ? "Impressora"
                : "Modelo"}
            </SheetTitle>
            <SheetDescription>
              Faça as alterações necessárias e clique em salvar.
            </SheetDescription>
          </SheetHeader>

          <div className="grid gap-4 px-4 py-4">
            {/* FORMULÁRIO: USUÁRIO */}
            {isUser && (
              <>
                <div className="grid gap-2">
                  <Label>Nome Completo</Label>
                  <Input name="name" defaultValue={data.name} required />
                </div>
                <div className="grid gap-2">
                  <Label>E-mail</Label>
                  <Input
                    name="email"
                    type="email"
                    defaultValue={data.email}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label>Permissão</Label>
                    <SearchableSelect
                      name="role"
                      defaultValue={data.role}
                      options={[
                        { value: "USER", label: "Usuário" },
                        { value: "ADMIN", label: "Administrador" },
                      ]}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>Status</Label>
                    <SearchableSelect
                      name="status"
                      defaultValue={data.status}
                      options={[
                        { value: "AUTHORIZED", label: "Autorizado" },
                        { value: "UNAUTHORIZED", label: "Não Autorizado" },
                      ]}
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label>Setor</Label>
                  <SearchableSelect
                    name="sectorId"
                    defaultValue={data.sectorId || "none"}
                    placeholder="Selecione um setor"
                    options={[
                      { value: "none", label: "Nenhum Setor" },
                      ...sectors.map((s) => ({ value: s.id, label: s.name })),
                    ]}
                  />
                </div>
              </>
            )}

            {/* FORMULÁRIO: SETOR */}
            {isSector && (
              <>
                <div className="grid gap-2">
                  <Label>Nome do Setor</Label>
                  <Input name="name" defaultValue={data.name} required />
                </div>
                <div className="grid gap-2">
                  <Label>Coordenador</Label>
                  <Input
                    name="coordinatorName"
                    defaultValue={data.coordinatorName}
                    required
                  />
                </div>
              </>
            )}

            {/* FORMULÁRIO: IMPRESSORA */}
            {isPrinter && (
              <>
                <div className="grid gap-2">
                  <Label>Marca</Label>
                  <Input name="brand" defaultValue={data.brand} required />
                </div>
                <div className="grid gap-2">
                  <Label>Modelo</Label>
                  <Input name="model" defaultValue={data.model} required />
                </div>
              </>
            )}

            {/* FORMULÁRIO: MODELO DE ETIQUETA */}
            {isLabelModel && (
              <>
                <div className="grid gap-2">
                  <Label>Nome do Modelo</Label>
                  <Input name="name" defaultValue={data.name} required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label>Largura (mm)</Label>
                    <Input
                      name="widthMm"
                      type="number"
                      step="0.1"
                      defaultValue={data.widthMm}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>Altura (mm)</Label>
                    <Input
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

          <SheetFooter className="mt-auto pt-4">
            <Button type="submit" className="w-full">
              Salvar Informações
            </Button>
            <SheetClose asChild>
              <Button type="button" variant="outline" className="w-full">
                Cancelar
              </Button>
            </SheetClose>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
