"use client";

import { LabelModel } from "@/generated/prisma/client";
import { ColumnDef } from "@tanstack/react-table";

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
];
