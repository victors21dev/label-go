"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "motion/react";
import {
  LayoutDashboard,
  Printer,
  Settings,
  Table,
  Ticket,
  History,
  FileText,
  UserIcon,
  PanelRightOpen,
  PanelRightClose,
} from "lucide-react";

import SidebarButton from "./sidebar-button";
import { ModeToggle } from "./button-mode-togle";
import { cn } from "@/app/_lib/utils";

const ICON_SIZE = 20;

const navItems = [
  { href: "/", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/labels", icon: Ticket, label: "Etiquetas" },
  { href: "/reports", icon: FileText, label: "Relatórios" },
  { href: "/history", icon: History, label: "Histórico" },
  { href: "/sectors", icon: Table, label: "Setores" },
];

const adminItems = [
  { href: "/printers", icon: Printer, label: "Impressoras" },
  { href: "/users", icon: UserIcon, label: "Usuários" },
  { href: "/config", icon: Settings, label: "Configuração" },
];

const Sidebar = () => {
  const { data: session } = useSession();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const isAdmin = (session?.user as any)?.role === "ADMIN";
  const user = session?.user as any;

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? 72 : 260 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={cn(
        "relative flex flex-col h-screen border-r bg-card shrink-0 overflow-hidden",
        isCollapsed ? "items-center" : ""
      )}
    >
      {/* LOGO + TOGGLE */}
      <div
        className={cn(
          "shrink-0 border-b flex items-center",
          isCollapsed ? "justify-center py-6" : "px-6 py-5 justify-between"
        )}
      >
        {isCollapsed ? (
          <div className="flex flex-col items-center gap-4">
            <span className="text-lg font-extrabold tracking-tight text-primary select-none">
              LG
            </span>
            <button
              onClick={() => setIsCollapsed(false)}
              className="flex h-7 w-7 items-center justify-center rounded-md border bg-background shadow-sm hover:bg-accent transition-colors text-muted-foreground hover:text-primary"
            >
              <PanelRightOpen size={14} />
            </button>
          </div>
        ) : (
          <>
            <div>
              <h1 className="text-lg font-bold tracking-tight">
                LABEL<span className="text-primary">-GO</span>
              </h1>
              <p className="text-[10px] text-muted-foreground tracking-wide mt-1">
                Sistema de Etiquetas
              </p>
            </div>
            <div className="flex items-center gap-2">
              <ModeToggle />
              <button
                onClick={() => setIsCollapsed(true)}
                className="flex h-6 w-6 items-center justify-center rounded-md border bg-background shadow-sm hover:bg-accent transition-colors text-muted-foreground"
              >
                <PanelRightClose size={14} />
              </button>
            </div>
          </>
        )}
      </div>

      {/* NAVEGAÇÃO */}
      <nav className="flex-1 overflow-y-auto no-scrollbar py-4">
        <div className={cn("flex flex-col gap-1", isCollapsed ? "items-center px-2" : "px-3")}>
          {navItems.map((item) => (
            <SidebarButton key={item.href} href={item.href}>
              <item.icon
                size={ICON_SIZE}
                className={cn("shrink-0", isCollapsed ? "" : "")}
              />
              {!isCollapsed && <span>{item.label}</span>}
            </SidebarButton>
          ))}
        </div>

        {isAdmin && (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-4"
            >
              {!isCollapsed && (
                <div className="px-6 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="h-px flex-1 bg-border" />
                    <span className="text-[10px] uppercase font-semibold text-muted-foreground tracking-widest">
                      Admin
                    </span>
                    <span className="h-px flex-1 bg-border" />
                  </div>
                </div>
              )}
              <div className={cn("flex flex-col gap-1", isCollapsed ? "items-center px-2" : "px-3")}>
                {adminItems.map((item) => (
                  <SidebarButton key={item.href} href={item.href}>
                    <item.icon size={ICON_SIZE} className="shrink-0" />
                    {!isCollapsed && <span>{item.label}</span>}
                  </SidebarButton>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        )}
      </nav>

      {/* USER INFO */}
      {user && (
        <div
          className={cn(
            "shrink-0 border-t bg-muted/30",
            isCollapsed ? "p-3 flex flex-col items-center gap-2" : "p-4"
          )}
        >
          {isCollapsed ? (
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-primary-foreground text-xs font-bold">
              {user.name?.charAt(0)?.toUpperCase() || "U"}
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-primary-foreground text-sm font-bold shrink-0">
                {user.name?.charAt(0)?.toUpperCase() || "U"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {user.name?.split(" ")[0] || "Usuário"}
                </p>
                <p className="text-[10px] text-muted-foreground truncate">
                  {isAdmin ? (
                    <span className="inline-flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      Administrador
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                      Usuário
                    </span>
                  )}
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </motion.aside>
  );
};

export default Sidebar;
