"use client";

import { LabelModel } from "@/generated/prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableRowActions } from "@/app/_components/data-table-row-actions";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/app/_components/ui/button";

export const LabelModelTableColumns: ColumnDef<LabelModel>[] = [
  {
    accessorKey: "name",
    header: "Nome",
  },
  {
    accessorKey: "widthMm",
    header: "Largura",
  },
  {
    accessorKey: "heightMm",
    header: "Altura",
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Data de Criação
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"));
      return new Intl.DateTimeFormat("pt-BR", {
        timeZone: "America/Sao_Paulo",
        dateStyle: "short",
        timeStyle: "short",
      }).format(date);
    },
  },
  {
    header: "Ações",
    id: "actions",
    cell: ({ row }) => (
      <DataTableRowActions
        row={row}
        onEdit={(item) => console.log("Editando", item.name)}
        onDelete={(item) => console.log("Deletando", item.id)}
      />
    ),
  },
];
