"use client";

import { deletePrinter } from "@/app/_actions/printers";
import { DataTableRowActions } from "@/app/_components/data-table-row-actions";
import { Printer } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const printerTableColumns: ColumnDef<Printer>[] = [
  {
    accessorKey: "brand",
    header: "Marca",
  },
  {
    accessorKey: "model",
    header: "Modelo",
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
          await deletePrinter(label.id);
          toast.success("Impressora removida!");
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
            title: "Excluir Impressora",
            description: `Tem certeza que deseja apagar a impressora "${label.model}"?`,
            onConfirm: handleDelete,
          }}
        />
      );
    },
  },
];
