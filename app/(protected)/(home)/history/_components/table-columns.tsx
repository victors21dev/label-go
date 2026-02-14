"use client";

import { LabelGeneration } from "@/generated/prisma/client";
import { ColumnDef } from "@tanstack/react-table";

export const historyTableColumns: ColumnDef<LabelGeneration>[] = [
  {
    accessorKey: "labelModel",
    header: "Modelo",
  },
  {
    accessorKey: "sector",
    header: "Setor",
  },
  {
    accessorKey: "printer",
    header: "Impressora",
  },
  {
    accessorKey: "quantity",
    header: "Quantidade",
  },
  {
    accessorKey: "user",
    header: "Usuário",
  },
  {
    accessorKey: "date",
    header: "Validade",
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
