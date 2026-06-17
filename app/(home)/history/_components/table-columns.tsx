"use client";

import { deleteHistory } from "@/app/_actions/history-delete";
import { DataTableRowActions } from "@/app/_components/data-table-row-actions";
import { Badge } from "@/app/_components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";
import {
  CalendarDays,
  Printer,
  Tag,
  User,
  Building2,
  Hash,
  FileText,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const historyTableColumns: ColumnDef<any>[] = [
  {
    id: "modelo",
    accessorKey: "labelModel.name",
    header: "Modelo",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Tag className="h-4 w-4 text-chart-2" />
        <span className="font-medium">{row.original.labelModel.name}</span>
      </div>
    ),
  },
  {
    accessorKey: "sector.name",
    header: "Setor",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Building2 className="h-4 w-4 text-muted-foreground" />
        <span>{row.original.sector.name}</span>
      </div>
    ),
  },
  {
    accessorKey: "printer.brand",
    header: "Impressora",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Printer className="h-4 w-4 text-muted-foreground" />
        <span>{row.original.printer.brand} {row.original.printer.model}</span>
      </div>
    ),
  },
  {
    accessorKey: "quantity",
    header: "Qtd",
    cell: ({ row }) => (
      <Badge variant="secondary" className="font-mono">
        <Hash className="h-3 w-3 mr-1" />
        {row.original.quantity}
      </Badge>
    ),
  },
  {
    accessorKey: "user.name",
    header: "Usuário",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <User className="h-4 w-4 text-muted-foreground" />
        <span>{row.original.user.name}</span>
      </div>
    ),
  },
  {
    id: "justificativa",
    accessorKey: "justification",
    header: "Justificativa",
    cell: ({ row }) => {
      const text = row.original.justification;
      return (
        <div className="flex items-center gap-2 max-w-[200px]">
          <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
          <span className="truncate text-sm text-muted-foreground" title={text}>
            {text || "—"}
          </span>
        </div>
      );
    },
  },
  {
    id: "status",
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      const isGenerated = status === "GENERATED";
      return (
        <Badge
          variant={isGenerated ? "default" : "destructive"}
          className="gap-1.5"
        >
          {isGenerated ? (
            <CheckCircle2 className="h-3 w-3" />
          ) : (
            <AlertCircle className="h-3 w-3" />
          )}
          {isGenerated ? "Gerado" : "Cancelado"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "date",
    header: "Validade",
    cell: ({ row }) => {
      const date = new Date(row.original.date);
      return (
        <div className="flex items-center gap-2 text-sm">
          <CalendarDays className="h-4 w-4 text-muted-foreground" />
          {new Intl.DateTimeFormat("pt-BR", {
            dateStyle: "short",
          }).format(date)}
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Criação",
    cell: ({ row }) => {
      const date = new Date(row.original.createdAt);
      return (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <CalendarDays className="h-4 w-4" />
          {new Intl.DateTimeFormat("pt-BR", {
            timeZone: "America/Sao_Paulo",
            dateStyle: "short",
            timeStyle: "short",
          }).format(date)}
        </div>
      );
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
            title: "Excluir Histórico",
            description: `Tem certeza que deseja apagar este registro?`,
            onConfirm: handleDelete,
          }}
          editOn={false}
        />
      );
    },
  },
];
