"use client";

import { ReactNode, useEffect, useState } from "react";
import { Row } from "@tanstack/react-table";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/_components/ui/select";
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

  const isUser = "username" in data && "role" in data;

  // Carrega setores apenas se for edição de usuário
  useEffect(() => {
    if (isUser && isOpen) {
      getSectors().then(setSectors);
    }
  }, [isUser, isOpen]);

  async function handleSubmit(formData: FormData) {
    try {
      await updateDataAction(data.id, isUser ? "user" : "other", formData);
      toast.success("Atualizado com sucesso!");
      setIsOpen(false);
    } catch (error) {
      toast.error("Erro na atualização.");
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>{openButton}</SheetTrigger>
      <SheetContent className="sm:max-w-md">
        <form action={handleSubmit} className="flex flex-col h-full gap-4">
          <SheetHeader>
            <SheetTitle>Editar Usuário</SheetTitle>
            <SheetDescription>
              Altere as permissões e status do usuário.
            </SheetDescription>
          </SheetHeader>

          <div className="grid gap-4 px-4 py-4">
            <div className="grid gap-2">
              <Label>Nome Completo</Label>
              <Input name="name" defaultValue={data.name} required />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* SELECT PARA ROLE */}
              <div className="grid gap-2">
                <Label>Cargo (Role)</Label>
                <Select name="role" defaultValue={data.role}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USER">USER</SelectItem>
                    <SelectItem value="ADMIN">ADMIN</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* SELECT PARA STATUS */}
              <div className="grid gap-2">
                <Label>Status</Label>
                <Select name="status" defaultValue={data.status}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AUTHORIZED">AUTHORIZED</SelectItem>
                    <SelectItem value="UNAUTHORIZED">UNAUTHORIZED</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* SELECT PARA SETOR (DINÂMICO) */}
            <div className="grid gap-2">
              <Label>Setor</Label>
              <Select name="sectorId" defaultValue={data.sectorId || ""}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um setor" />
                </SelectTrigger>
                <SelectContent>
                  {sectors.map((sector) => (
                    <SelectItem key={sector.id} value={sector.id}>
                      {sector.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <SheetFooter className="mt-auto">
            <Button type="submit" className="w-full">
              Salvar Informações
            </Button>
            <SheetClose asChild>
              <Button variant="outline" className="w-full">
                Cancelar
              </Button>
            </SheetClose>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
