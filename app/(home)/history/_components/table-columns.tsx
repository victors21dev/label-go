"use client";

import { ColumnDef } from "@tanstack/react-table";

// Usamos any para permitir o acesso às propriedades incluídas pelo Prisma (include)
export const historyTableColumns: ColumnDef<any>[] = [
  {
    id: "modelo",
    accessorKey: "labelModel.name",
    header: "Modelo",
  },
  {
    accessorKey: "sector.name",
    header: "Setor",
  },
  {
    accessorKey: "printer.brand",
    header: "Impressora",
  },
  {
    accessorKey: "quantity",
    header: "Quantidade",
  },
  {
    accessorKey: "user.name",
    header: "Usuário",
  },
  {
    accessorKey: "date",
    header: "Validade",
    cell: ({ row }) => {
      const date = new Date(row.original.date);
      return new Intl.DateTimeFormat("pt-BR", {
        dateStyle: "short",
        timeStyle: "short",
      }).format(date);
    },
  },
  {
    accessorKey: "createdAt",
    header: "Data de Criação",
    cell: ({ row }) => {
      const date = new Date(row.original.createdAt);
      return new Intl.DateTimeFormat("pt-BR", {
        timeZone: "America/Sao_Paulo",
        dateStyle: "short",
        timeStyle: "short",
      }).format(date);
    },
  },
];
