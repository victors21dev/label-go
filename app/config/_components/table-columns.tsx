"use client";

import { LabelModel } from "@/generated/prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableRowActions } from "@/app/_components/data-table-row-actions";

export const LabelModelTableColumns: ColumnDef<LabelModel>[] = [
  {
    accessorKey: "name",
    header: "Nome da Etiqueta",
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
        onEdit={(item) => console.log("Editando", item.name)}
        onDelete={(item) => console.log("Deletando", item.id)}
      />
    ),
  },
];
