import {
  LayoutDashboard,
  LayoutGrid,
  PackageIcon,
  Settings,
  ShoppingBasketIcon,
  Table,
  Ticket,
} from "lucide-react";
import SidebarButton from "./sidebar-button";
import { ModeToggle } from "./button-mode-togle";

let icon_size = 20;

const Sidebar = () => {
  return (
    <div className="w-64 bg-card">
      {/* IMAGEM */}
      <div className="px-8 py-6">
        <div className="flex gap-2 items-center">
          <h1 className="text-2xl font-bold text-nowrap">LABEL-GO</h1>
          <ModeToggle />
        </div>
      </div>
      {/* Botões */}
      <div className="flex flex-col gap-2 p-2">
        <SidebarButton href="/">
          <LayoutDashboard size={icon_size} />
          Dashboard
        </SidebarButton>
        <SidebarButton href="/labels">
          <Ticket size={icon_size} />
          Etiquetas
        </SidebarButton>
        <SidebarButton href="/sectors">
          <Table size={icon_size} />
          Setores
        </SidebarButton>
        <hr />
        <SidebarButton href="/config">
          <Settings size={icon_size} />
          Configuração
        </SidebarButton>
      </div>
    </div>
  );
};

export default Sidebar;
