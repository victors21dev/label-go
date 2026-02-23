"use client";

import { deleteUser } from "@/app/_actions/users";
import { DataTableRowActions } from "@/app/_components/data-table-row-actions";
import { User } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

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
    cell: ({ row }) => {
      const label = row.original;
      const router = useRouter();

      const handleDelete = async () => {
        try {
          await deleteUser(label.id);
          toast.success("Usuário removido!");
          router.refresh();
        } catch (error) {
          toast.error("Erro ao deletar.");
        }
      };

      return (
        <DataTableRowActions
          row={row}
          onEdit={(item) => console.log("Edit", item)}
          deleteOptions={{
            title: "Excluir usuário",
            description: `Tem certeza que deseja apagar o usuário "${label.name}"?`,
            onConfirm: handleDelete,
          }}
        />
      );
    },
  },
];
