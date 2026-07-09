"use client";

import { deletePrinter } from "@/app/_actions/printers-delete";
import { DataTableRowActions } from "@/app/_components/data-table-row-actions";
import { SortableHeader } from "@/app/_components/sortable-header";
import { Printer } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { Info, PrinterIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const printerTableColumns: ColumnDef<Printer>[] = [
  {
    accessorKey: "brand",
    header: ({ column }) => <SortableHeader column={column} label="Marca" />,
    cell: ({ row }) => {
      const brand = row.getValue("brand") as string;
      return (
        <div className="flex items-center gap-2">
          <PrinterIcon className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">{brand}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "model",
    header: ({ column }) => <SortableHeader column={column} label="Modelo" />,
    cell: ({ row }) => {
      const model = row.getValue("model") as string;
      return (
        <div className="flex items-center gap-2">
          <Info className="h-4 w-4 text-muted-foreground" />
          <span>{model}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => <SortableHeader column={column} label="Data de Criação" />,
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
          editOn={true}
        />
      );
    },
  },
];
