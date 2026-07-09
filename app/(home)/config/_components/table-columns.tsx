"use client";

import { SortableHeader } from "@/app/_components/sortable-header";
import { LabelModel } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableRowActions } from "@/app/_components/data-table-row-actions";
import { RulerDimensionLine, Ticket } from "lucide-react";
import { deleteLabelModel } from "@/app/_actions/label-model-delete";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export const LabelModelTableColumns: ColumnDef<LabelModel>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => <SortableHeader column={column} label="Nome Modelo da Etiqueta" />,
    cell: ({ row }) => {
      const name = row.getValue("name") as string;

      return (
        <div className="flex items-center gap-2 font-medium">
          <Ticket className="h-4 w-4 text-muted-foreground" />
          <span>{name}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "widthMm",
    header: ({ column }) => <SortableHeader column={column} label="Largura" />,
    cell: ({ row }) => {
      const value = row.getValue("widthMm") as number;
      // Opcional: Se quiser converter mm para cm, divida por 10.
      // Se o valor já for cm, mantenha apenas {value}.
      return (
        <div className="flex items-center gap-2">
          <RulerDimensionLine className="h-4 w-4 text-muted-foreground" />
          <span>{value} cm</span>
        </div>
      );
    },
  },
  {
    accessorKey: "heightMm",
    header: ({ column }) => <SortableHeader column={column} label="Altura" />,
    cell: ({ row }) => {
      const value = row.getValue("heightMm") as number;
      return (
        <div className="flex items-center gap-2">
          {/* Rotação de 90 graus para indicar altura vertical */}
          <RulerDimensionLine className="h-4 w-4 text-muted-foreground rotate-90" />
          <span>{value} cm</span>
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
          deleteOptions={{
            title: "Excluir Modelo",
            description: `Tem certeza que deseja apagar o modelo "${label.name}"?`,
            onConfirm: handleDelete,
          }}
          editOn={true}
        />
      );
    },
  },
];
