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
        <Button variant="ghost" size="icon-sm" className="hover:bg-accent">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-44">
        <DropdownMenuItem
          onClick={() => navigator.clipboard.writeText(element.id)}
          className="cursor-pointer"
        >
          <Copy className="mr-3 h-4 w-4 text-muted-foreground" />
          <span>Copiar chave</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {editOn && (
          <SheetComponent
            dataTable={row}
            openButton={
              <DropdownMenuItem
                onSelect={(e) => e.preventDefault()}
                className="cursor-pointer"
              >
                <Edit className="mr-3 h-4 w-4 text-muted-foreground" />
                <span>Editar</span>
              </DropdownMenuItem>
            }
          />
        )}

        {deleteOptions && (
          <DropdownMenuItem
            onSelect={(e) => e.preventDefault()}
            className="p-0 focus:bg-transparent"
          >
            <ConfirmDialog
              title={deleteOptions.title}
              description={deleteOptions.description}
              onConfirm={deleteOptions.onConfirm}
              trigger={
                <div className="flex w-full items-center gap-3 px-2 py-1.5 text-destructive cursor-pointer rounded-sm hover:bg-destructive/10 transition-colors">
                  <Trash2 className="h-4 w-4" />
                  <span>Excluir</span>
                </div>
              }
            />
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
