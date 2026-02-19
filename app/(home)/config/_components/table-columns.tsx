"use client";

import { LabelModel } from "@/generated/prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableRowActions } from "@/app/_components/data-table-row-actions";
import { ArrowUpDown, Trash2 } from "lucide-react";
import { Button } from "@/app/_components/ui/button";
import { deleteLabelModel } from "@/app/_actions/label-model";
import { toast } from "sonner";
import { ConfirmDialog } from "@/app/_components/confirmDialog";
import { useRouter } from "next/navigation";

export const LabelModelTableColumns: ColumnDef<LabelModel>[] = [
  {
    accessorKey: "name",
    header: "Nome",
  },
  {
    accessorKey: "widthMm",
    header: "Largura",
    cell: ({ row }) => `${row.getValue("widthMm")} mm`,
  },
  {
    accessorKey: "heightMm",
    header: "Altura",
    cell: ({ row }) => `${row.getValue("heightMm")} mm`,
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Data de Criação
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
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
          await deleteLabelModel(label.id);
          toast.success("Modelo removido!");
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
            title: "Excluir Modelo",
            description: `Tem certeza que deseja apagar o modelo "${label.name}"?`,
            onConfirm: handleDelete,
          }}
        />
      );
    },
  },
];
