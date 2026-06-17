"use client";

import { useSession, signOut } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/app/_components/ui/dropdown-menu";
import { Button } from "@/app/_components/ui/button";
import {
  Avatar,
  AvatarFallback,
} from "@/app/_components/ui/avatar";
import { Badge } from "@/app/_components/ui/badge";
import {
  LogOut,
  User,
  Settings,
  Shield,
  Mail,
} from "lucide-react";

const roleLabel: Record<string, string> = {
  ADMIN: "Administrador",
  USER: "Usuário",
};

const statusVariant: Record<string, "default" | "destructive" | "secondary" | "outline"> = {
  AUTHORIZED: "default",
  UNAUTHORIZED: "destructive",
};

export function UserNav() {
  const { data: session } = useSession();

  if (!session?.user) return null;

  const user = session.user as any;
  const initials = user.name
    ?.split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:ring-2 hover:ring-ring/30 transition-all">
          <Avatar className="h-10 w-10 border">
            <AvatarFallback className="bg-gradient-to-br from-primary to-primary/70 text-primary-foreground font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-64" align="end" forceMount>
        {/* Header */}
        <DropdownMenuLabel className="p-0">
          <div className="flex items-center gap-3 px-3 py-3">
            <Avatar className="h-11 w-11 border-2 border-border">
              <AvatarFallback className="bg-gradient-to-br from-primary to-primary/70 text-primary-foreground font-semibold text-sm">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-1 flex-1 min-w-0">
              <p className="text-sm font-semibold leading-none truncate">
                {user.name}
              </p>
              <div className="flex items-center gap-1.5">
                <Mail className="h-3 w-3 text-muted-foreground shrink-0" />
                <p className="text-xs text-muted-foreground truncate">
                  {user.email}
                </p>
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <Badge
                  variant={statusVariant[user.status] || "secondary"}
                  className="h-5 text-[10px] px-1.5 gap-1"
                >
                  <Shield className="h-2.5 w-2.5" />
                  {roleLabel[user.role] || user.role}
                </Badge>
              </div>
            </div>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        {/* Menu items */}
        <DropdownMenuGroup>
          <DropdownMenuItem className="cursor-pointer gap-3 py-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <div className="flex flex-col">
              <span className="text-sm">Meu Perfil</span>
              <span className="text-xs text-muted-foreground">Ver informações da conta</span>
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer gap-3 py-2">
            <Settings className="h-4 w-4 text-muted-foreground" />
            <div className="flex flex-col">
              <span className="text-sm">Configurações</span>
              <span className="text-xs text-muted-foreground">Preferências do sistema</span>
            </div>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        {/* Logout */}
        <DropdownMenuItem
          className="cursor-pointer gap-3 py-2 text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/30"
          onClick={() => signOut({ callbackUrl: "/login" })}
        >
          <LogOut className="h-4 w-4" />
          <div className="flex flex-col">
            <span className="text-sm">Sair</span>
            <span className="text-xs text-red-500/70">Encerrar sessão atual</span>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
