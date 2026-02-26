"use client";

import { Row } from "@tanstack/react-table";
import { Copy, Edit, MoreHorizontal, Trash2 } from "lucide-react";

import { Button } from "@/app/_components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/app/_components/ui/dropdown-menu";
import { ReactNode } from "react";
import { ConfirmDialog } from "./confirmDialog";
import { SheetComponent } from "./sheet";

interface WithId {
  id: string;
}

interface DataTableRowActionsProps<TData extends WithId> {
  row: Row<TData>;
  onEdit?: (value: TData) => void;
  deleteOptions?: {
    title: string;
    description: string;
    onConfirm: () => void;
  };
  editOn: Boolean;
}

export function DataTableRowActions<TData extends WithId>({
  row,
  deleteOptions,
  editOn = true,
}: DataTableRowActionsProps<TData>) {
  const element = row.original;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => navigator.clipboard.writeText(element.id)}
        >
          <Copy className="mr-2 h-4 w-4" />
          Copiar chave
        </DropdownMenuItem>

        <DropdownMenuSeparator />
        <div className="flex flex-col gap-2">
          {editOn && (
            <SheetComponent
              dataTable={row}
              openButton={
                <DropdownMenuItem
                  onSelect={(e) => e.preventDefault()}
                  className="cursor-pointer"
                >
                  <Edit className="mr-2 h-4 w-4" />
                  <span>Editar</span>
                </DropdownMenuItem>
              }
            />
          )}

          {deleteOptions && (
            <DropdownMenuItem
              onSelect={(e) => e.preventDefault()}
              className="p-0"
            >
              <ConfirmDialog
                title={deleteOptions.title}
                description={deleteOptions.description}
                onConfirm={deleteOptions.onConfirm}
                trigger={
                  <div className="flex px-2 gap-2 py-2 text-destructive">
                    <Trash2 className="mr-2 h-4 w-4 text-destructive" />
                    <span>Excluir</span>
                  </div>
                }
              />
            </DropdownMenuItem>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
