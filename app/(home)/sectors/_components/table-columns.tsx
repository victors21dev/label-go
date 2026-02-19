"use client";

import { DataTableRowActions } from "@/app/_components/data-table-row-actions";
import { Sector } from "@/generated/prisma/client";
import { ColumnDef } from "@tanstack/react-table";

export const sectorTableColumns: ColumnDef<Sector>[] = [
  {
    accessorKey: "name",
    header: "Nome do setor",
  },
  {
    accessorKey: "coordinatorName",
    header: "Coordenador(a)",
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
