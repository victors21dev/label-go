"use client";
import Link from "next/link";
import { Button } from "./ui/button";
import { usePathname } from "next/navigation";

import { motion } from "motion/react";

interface SidebarButtonProps {
  children: React.ReactNode;
  href: string;
}

const SidebarButton = ({ href, children }: SidebarButtonProps) => {
  const pathname = usePathname();
  return (
    <motion.div whileHover={{ scale: 1.1 }} className="flex w-full hover:">
      <Button
        className={`justify-start gap-2 px-6 py-3 w-full text-foreground hover:bg-chart-1 hover:text-popover-foreground ${
          pathname === href ? "bg-primary text-background" : "bg-muted"
        }`}
        asChild
      >
        <Link href={href}>{children}</Link>
      </Button>
    </motion.div>
  );
};

export default SidebarButton;
