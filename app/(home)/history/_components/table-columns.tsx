"use client";

import { deleteHistory } from "@/app/_actions/history-delete";
import { DataTableRowActions } from "@/app/_components/data-table-row-actions";
import { ColumnDef } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

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
  {
    header: "Ações",
    id: "actions",
    cell: ({ row }) => {
      const label = row.original;
      const router = useRouter();

      const handleDelete = async () => {
        try {
          await deleteHistory(label.id);
          toast.success("Histórico removido!");
          router.refresh();
        } catch (error) {
          toast.error("Erro ao deletar.");
        }
      };

      return (
        <DataTableRowActions
          row={row}
          deleteOptions={{
            title: "Excluir Impressora",
            description: `Tem certeza que deseja apagar o histórico? "${label.createdAt}"?`,
            onConfirm: handleDelete,
          }}
          editOn={false}
        />
      );
    },
  },
];
