"use client";

import { deleteSector } from "@/app/_actions/sectors-delete";
import { DataTableRowActions } from "@/app/_components/data-table-row-actions";
import { Sector } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { Building2, UserCog } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const sectorTableColumns: ColumnDef<Sector>[] = [
  {
    accessorKey: "name",
    cell: ({ row }) => {
      const name = row.getValue("name") as string;
      return (
        <div className="flex items-center gap-2 font-medium">
          <Building2 className="h-4 w-4 text-primary" />
          <span>{name}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "coordinatorName",
    header: "Coordenador(a)",
    cell: ({ row }) => {
      const coordinator = row.getValue("coordinatorName") as string;
      return (
        <div className="flex items-center gap-2">
          <UserCog className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">{coordinator}</span>
        </div>
      );
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
  {
    header: "Ações",
    id: "actions",
    cell: ({ row }) => {
      const label = row.original;
      const router = useRouter();

      const handleDelete = async () => {
        try {
          await deleteSector(label.id);
          toast.success("Setor removido!");
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
            title: "Excluir Setor",
            description: `Tem certeza que deseja apagar o setor "${label.name}"?`,
            onConfirm: handleDelete,
          }}
        />
      );
    },
  },
];
