"use client";

import { deleteUser } from "@/app/_actions/users";
import { DataTableRowActions } from "@/app/_components/data-table-row-actions";
import { Badge } from "@/app/_components/ui/badge";
import { User } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { UserIcon, ShieldCheck } from "lucide-react";

const roleTranslations: Record<string, string> = {
  ADMIN: "Administrador",
  USER: "Usuário",
};

export const userTableColumns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: "Nome",
    cell: ({ row }) => {
      const name = row.getValue("name") as string;
      const imageUrl = row.original.imageUrl;
      return (
        <div className="flex items-center gap-3">
          <img
            className="w-8 h-8 rounded-full object-cover hover:"
            src={
              imageUrl || "/default-avatar-icon-of-social-media-user-vector.jpg"
            }
            alt={`Foto de ${name}`}
          />
          <span className="font-medium">{name}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "username",
    header: "Usuário",
    cell: ({ row }) => {
      const role = row.original.role;
      const username = row.getValue("username") as string;

      return (
        <div className="flex items-center gap-2">
          {role === "ADMIN" ? (
            <div className="flex items-center gap-2 text-chart-3 font-medium">
              <ShieldCheck className="h-4 w-4" />
              <span>{username}</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-primary font-medium">
              <UserIcon className="h-4 w-4" />
              <span>{username}</span>
            </div>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "role",
    header: "Permissão",
    cell: ({ row }) => {
      const role = row.original.role;

      const translatedRole = roleTranslations[role] ?? role;

      return (
        <Badge
          variant="outline"
          className={
            role === "ADMIN"
              ? "border-chart-3 text-chart-3"
              : "border-primary text-primary"
          }
        >
          {translatedRole}
        </Badge>
      );
    },
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;

      if (status === "AUTHORIZED") {
        return (
          <Badge className="bg-chart-3 text-white border-none">
            Autorizado
          </Badge>
        );
      }

      return (
        <Badge variant="destructive" className="border-none">
          Não Autorizado
        </Badge>
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
