import { LayoutGrid, PackageIcon, ShoppingBasketIcon } from "lucide-react";
import SidebarButton from "./sidebar-button";
import { ModeToggle } from "./button-mode-togle";

const Sidebar = () => {
  return (
    <div className="w-64 bg-secondary">
      {/* IMAGEM */}
      <div className="px-8 py-6">
        <div className="flex gap-2 items-center">
          <h1 className="text-2xl font-bold">STOCKLY</h1>
          <ModeToggle />
        </div>
      </div>
      {/* Botões */}
      <div className="flex flex-col gap-2 p-2">
        <SidebarButton href="/">Dashboard</SidebarButton>
        <SidebarButton href="/labels">Etiquetas</SidebarButton>
        <SidebarButton href="/sectors">Setores</SidebarButton>
      </div>
    </div>
  );
};

export default Sidebar;
