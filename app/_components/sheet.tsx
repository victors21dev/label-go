import { ReactNode } from "react";
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

import { Row } from "@tanstack/react-table"; // Importe o tipo Row

type SheetComponent = {
  openButton: ReactNode;
  dataTable: Row<any>;
};

export function SheetComponent({ openButton, dataTable }: SheetComponent) {
  const data = dataTable.original;
  console.log(data);
  return (
    <Sheet>
      <SheetTrigger asChild>{openButton}</SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Editar</SheetTitle>
          <SheetDescription>
            Faça a edição dos seus dados e salve abaixo
          </SheetDescription>
        </SheetHeader>
        {/* Colocar o formulário aqui */}
        {/* <div className="grid flex-1 auto-rows-min gap-6 px-4">
          <div className="grid gap-3">
            <Label htmlFor="sheet-demo-name">Name</Label>
            <Input id="sheet-demo-name" defaultValue="Pedro Duarte" />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="sheet-demo-username">Username</Label>
            <Input id="sheet-demo-username" defaultValue="@peduarte" />
          </div>
        </div> */}
        <SheetFooter>
          <Button type="submit">Salvar Informações</Button>
          <SheetClose asChild>
            <Button variant="outline">Fechar</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
