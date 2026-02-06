"use client";

import { DataTableRowActions } from "@/app/_components/data-table-row-actions";
import { Printer } from "@/generated/prisma/client";
import { ColumnDef } from "@tanstack/react-table";

export const printerTableColumns: ColumnDef<Printer>[] = [
  {
    accessorKey: "brand",
    header: "Marca",
  },
  {
    accessorKey: "model",
    header: "Modelo",
  },
  {
    accessorKey: "createdAt",
    header: "Data de Criação",
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
        onEdit={(item) => console.log("Editando", item.brand)}
        onDelete={(item) => console.log("Deletando", item.id)}
      />
    ),
  },
];
