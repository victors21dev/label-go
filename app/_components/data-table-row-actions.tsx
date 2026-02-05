"use client";

import { Row } from "@tanstack/react-table";
import { Copy, Edit, MoreHorizontal, Trash } from "lucide-react";

import { Button } from "@/app/_components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/app/_components/ui/dropdown-menu";

interface WithId {
  id: string;
}

interface DataTableRowActionsProps<TData extends WithId> {
  row: Row<TData>;
  onEdit?: (value: TData) => void;
  onDelete?: (value: TData) => void;
}

export function DataTableRowActions<TData extends WithId>({
  row,
  onEdit,
  onDelete,
}: DataTableRowActionsProps<TData>) {
  const element = row.original;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Abrir menu</span>
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

        <DropdownMenuItem onClick={() => onEdit?.(element)}>
          <Edit className="mr-2 h-4 w-4" />
          Editar
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => onDelete?.(element)}
          className="text-destructive focus:text-destructive"
        >
          <Trash className="mr-2 h-4 w-4 text-destructive" />
          Apagar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
