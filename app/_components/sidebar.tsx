"use client";
import {
  LayoutDashboard,
  Printer,
  Settings,
  Table,
  Ticket,
  History,
  UserIcon,
} from "lucide-react";
import SidebarButton from "./sidebar-button";
import { ModeToggle } from "./button-mode-togle";
import { useSession } from "next-auth/react";
import { motion } from "motion/react";

let icon_size = 20;

const Sidebar = () => {
  const { data: session } = useSession();

  // Verificamos se a role é ADMIN
  const isAdmin = (session?.user as any)?.role === "ADMIN";

  return (
    <div className="flex flex-col w-64 bg-muted justify-between h-screen border-r">
      <div>
        {/* LOGO E TOGGLE */}
        <div className="px-8 py-6">
          <div className="flex gap-2 items-center">
            <h1 className="text-2xl font-bold text-nowrap">
              <div className="flex">
                <div>LABEL-</div>
                <motion.div
                  whileHover={{
                    rotate: 360,
                  }}
                >
                  GO
                </motion.div>
              </div>
            </h1>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <ModeToggle />
            </motion.div>
          </div>
        </div>

        {/* Botões Comuns (Acessíveis por USER e ADMIN) */}
        <div className="flex flex-col gap-2 p-2 px-6 w-full">
          <SidebarButton href="/">
            <LayoutDashboard size={icon_size} />
            Dashboard
          </SidebarButton>
          <SidebarButton href="/labels">
            <Ticket size={icon_size} />
            Gerador de Etiquetas
          </SidebarButton>
          <SidebarButton href="/history">
            <History size={icon_size} />
            Histórico
          </SidebarButton>
          <SidebarButton href="/sectors">
            <Table size={icon_size} />
            Setores
          </SidebarButton>

          {/* Botões Restritos (Renderizados apenas para ADMIN) */}
          {isAdmin && (
            <>
              <div className="mt-4 mb-2">
                <hr className="border-muted-foreground/20" />
                <p className="text-[10px] uppercase font-bold text-muted-foreground mt-4 px-2 tracking-widest">
                  Administração
                </p>
              </div>
              <SidebarButton href="/printers">
                <Printer size={icon_size} />
                Impressoras
              </SidebarButton>
              <SidebarButton href="/users">
                <UserIcon size={icon_size} />
                Usuários
              </SidebarButton>
              <SidebarButton href="/config">
                <Settings size={icon_size} />
                Configuração
              </SidebarButton>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
