"use client";

import { DataTableRowActions } from "@/app/_components/data-table-row-actions";
import { User } from "@/generated/prisma/client";
import { ColumnDef } from "@tanstack/react-table";

export const userTableColumns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: "Usuário",
    cell: ({ row }) => {
      const name = row.getValue("name") as string;
      const imageUrl = row.original.imageUrl;
      return (
        <div className="flex items-center gap-3">
          <img
            className="w-8 h-8 rounded-full object-cover hover:"
            src={imageUrl || "/default-avatar.png"}
            alt={`Foto de ${name}`}
          />
          <span className="font-medium">{name}</span>
        </div>
      );
    },
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
