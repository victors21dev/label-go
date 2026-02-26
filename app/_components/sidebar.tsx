"use client";
import React, { useState } from "react";
import {
  LayoutDashboard,
  Printer,
  Settings,
  Table,
  Ticket,
  History,
  UserIcon,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import SidebarButton from "./sidebar-button";
import { ModeToggle } from "./button-mode-togle";
import { useSession, signOut } from "next-auth/react";
import { motion } from "motion/react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { cn } from "@/app/_lib/utils";

let icon_size = 20;

const Sidebar = () => {
  const { data: session } = useSession();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const user = session?.user as any;
  const isAdmin = user?.role === "ADMIN";

  return (
    <motion.div
      initial={false}
      animate={{ width: isCollapsed ? 80 : 256 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={cn(
        "relative flex flex-col bg-muted h-screen border-r shrink-0 transition-all",
        isCollapsed ? "items-center" : "items-start"
      )}
    >
      {/* BOTÃO DE TOGGLE - POSICIONADO EXATAMENTE NA BORDA */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-12 z-100 flex h-6 w-6 items-center justify-center rounded-full border bg-background shadow-sm hover:bg-accent transition-colors"
      >
        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      <div className="flex flex-col w-full h-full overflow-hidden">
        {/* HEADER: LOGO E MODE TOGGLE */}
        <div
          className={cn(
            "py-8 w-full shrink-0 flex items-center",
            isCollapsed ? "justify-center px-0" : "justify-between px-6"
          )}
        >
          {!isCollapsed ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2"
            >
              <h1 className="text-xl font-bold tracking-tighter">
                LABEL-<span className="text-primary">GO</span>
              </h1>
              <ModeToggle />
            </motion.div>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <motion.span
                whileHover={{ rotate: 360 }}
                className="font-bold text-lg"
              >
                GO
              </motion.span>
              {/* No modo SMALL, o toggle fica abaixo da logo ou suspenso */}
              <ModeToggle />
            </div>
          )}
        </div>

        {/* NAVEGAÇÃO PRINCIPAL */}
        <div
          className={cn(
            "flex flex-col gap-2 w-full flex-1 overflow-y-auto no-scrollbar",
            isCollapsed ? "px-3" : "px-4"
          )}
        >
          <SidebarButton href="/">
            <LayoutDashboard size={icon_size} />
            {!isCollapsed && (
              <span className="ml-3 font-medium">Dashboard</span>
            )}
          </SidebarButton>

          <SidebarButton href="/labels">
            <Ticket size={icon_size} />
            {!isCollapsed && (
              <span className="ml-3 font-medium">Etiquetas</span>
            )}
          </SidebarButton>

          <SidebarButton href="/history">
            <History size={icon_size} />
            {!isCollapsed && (
              <span className="ml-3 font-medium">Histórico</span>
            )}
          </SidebarButton>

          <SidebarButton href="/sectors">
            <Table size={icon_size} />
            {!isCollapsed && <span className="ml-3 font-medium">Setores</span>}
          </SidebarButton>

          {isAdmin && (
            <div className="flex flex-col gap-2 mt-4">
              <div className="px-2">
                <hr className="border-border/50" />
                {!isCollapsed && (
                  <p className="text-[10px] uppercase font-bold text-muted-foreground mt-4 tracking-widest">
                    Administração
                  </p>
                )}
              </div>
              <SidebarButton href="/printers">
                <Printer size={icon_size} />
                {!isCollapsed && (
                  <span className="ml-3 font-medium">Impressoras</span>
                )}
              </SidebarButton>
              <SidebarButton href="/users">
                <UserIcon size={icon_size} />
                {!isCollapsed && (
                  <span className="ml-3 font-medium">Usuários</span>
                )}
              </SidebarButton>
              <SidebarButton href="/config">
                <Settings size={icon_size} />
                {!isCollapsed && (
                  <span className="ml-3 font-medium">Configuração</span>
                )}
              </SidebarButton>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Sidebar;
