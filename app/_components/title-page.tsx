"use client";

import { motion } from "motion/react";
import { UserNav } from "./user-profile-button";
import * as Icons from "lucide-react";
import { cn } from "@/app/_lib/utils";

type TitleToPageProps = {
  title: string;
  description: string;
  icon?: Icons.LucideIcon;
  iconName?: string;
  iconBg?: string;
};

const TitleToPage = ({ title, description, icon, iconName, iconBg }: TitleToPageProps) => {
  const Icon = icon || (iconName ? (Icons as any)[iconName] as Icons.LucideIcon : undefined);

  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full flex justify-between items-center"
    >
      <div className="flex items-center gap-3">
        {Icon && (
          <div className={cn("p-2 rounded-lg", iconBg || "bg-primary/10 text-primary")}>
            <Icon className="h-5 w-5" />
          </div>
        )}
        <div>
          <h1 className="text-xl font-bold">{title}</h1>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      <div className="flex items-center">
        <UserNav />
      </div>
    </motion.header>
  );
};

export default TitleToPage;
