"use client";

import { User } from "@/generated/prisma/client";
import { ColumnDef } from "@tanstack/react-table";

export const userTableColumns: ColumnDef<User>[] = [
  {
    accessorKey: "nick",
    header: "Nome do nick",
  },
  {
    accessorKey: "role",
    header: "Permissão",
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
