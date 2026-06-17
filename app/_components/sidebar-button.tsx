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
    <Link href={href} className="relative block w-full">
      {isActive && (
        <motion.div
          layoutId="sidebar-active"
          className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-primary rounded-r-full"
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        />
      )}
      <motion.div
        whileHover={{ x: 2 }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        className={cn(
          "flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
          isActive
            ? "bg-primary/10 text-primary"
            : "text-muted-foreground hover:bg-accent hover:text-foreground"
        )}
      >
        {children}
      </motion.div>
    </Link>
  );
};

export default SidebarButton;
