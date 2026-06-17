"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { cn } from "@/app/_lib/utils";

interface SidebarButtonProps {
  children: React.ReactNode;
  href: string;
}

const SidebarButton = ({ href, children }: SidebarButtonProps) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      className="relative w-full"
    >
      {isActive && (
        <motion.div
          layoutId="sidebar-active"
          className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-chart-2 rounded-r-full"
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        />
      )}
      <Link
        href={href}
        className={cn(
          "flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 w-full",
          isActive
            ? "bg-chart-2/10 text-chart-2 shadow-sm"
            : "text-muted-foreground hover:bg-accent hover:text-foreground"
        )}
      >
        {children}
      </Link>
    </motion.div>
  );
};

export default SidebarButton;
