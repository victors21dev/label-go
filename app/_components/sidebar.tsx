"use client";
import {
  LayoutDashboard,
  Printer,
  Settings,
  Table,
  Ticket,
  History,
  UserIcon,
  LogOut,
} from "lucide-react";
import SidebarButton from "./sidebar-button";
import { ModeToggle } from "./button-mode-togle";
import { SignOutButton } from "@clerk/nextjs";

import { motion } from "motion/react";

let icon_size = 20;

const Sidebar = () => {
  return (
    <div className="flex flex-col w-64 bg-muted justify-between">
      <div>
        {/* IMAGEM */}
        <div className="px-8 py-6">
          <div className="flex gap-2 items-center">
            <h1 className="text-2xl font-bold text-nowrap">
              <div className="flex">
                <div>LABEL-</div>
                <motion.div
                  className="cursor-"
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
        {/* Botões */}
        <div className="flex flex-col gap-2 p-2 px-6 w-full">
          <SidebarButton href="/">
            <LayoutDashboard size={icon_size} />
            Dashboard
          </SidebarButton>
          <SidebarButton href="/labels">
            <Ticket size={icon_size} />
            Gerador de tiquetas
          </SidebarButton>
          <SidebarButton href="/history">
            <History size={icon_size} />
            Histórico
          </SidebarButton>
          <SidebarButton href="/sectors">
            <Table size={icon_size} />
            Setores
          </SidebarButton>
          <hr />
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
        </div>
      </div>
      <div className="flex p-2 justify-center">
        <SignOutButton>
          <div className="flex w-full gap-2 mb-4">
            <LogOut />
            Sair
          </div>
        </SignOutButton>
      </div>
    </div>
  );
};

export default Sidebar;
