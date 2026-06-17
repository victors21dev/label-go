"use client";

import { motion } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { cn } from "@/app/_lib/utils";
import * as Icons from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: Icons.LucideIcon;
  iconName?: string;
  gradient: string;
  iconBg: string;
  borderColor: string;
}

const StatCard = ({
  title,
  value,
  description,
  icon,
  iconName,
  gradient,
  iconBg,
  borderColor,
}: StatCardProps) => {
  const Icon = icon || (iconName ? (Icons as any)[iconName] as Icons.LucideIcon : undefined);

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
      }}
      whileHover={{
        y: -5,
        transition: { type: "spring", stiffness: 300 },
      }}
      className="group"
    >
      <Card
        className={cn(
          "border-l-4 overflow-hidden card-hover h-full",
          borderColor
        )}
      >
        <div className={cn("absolute inset-0 bg-gradient-to-br opacity-[0.03]", gradient)} />
        <CardHeader className="flex flex-row items-start justify-between pb-2 gap-2 relative">
          <CardTitle className="text-xs font-medium text-muted-foreground leading-tight">
            {title}
          </CardTitle>
          {Icon && (
            <div
              className={cn(
                "p-1.5 rounded-lg transition-transform group-hover:scale-110 shrink-0",
                iconBg
              )}
            >
              <Icon className="h-3.5 w-3.5" />
            </div>
          )}
        </CardHeader>
        <CardContent className="pt-0 relative">
          <div className="text-2xl font-bold tracking-tight">{value}</div>
          {description && (
            <p className="text-[10px] text-muted-foreground mt-0.5">
              {description}
            </p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default StatCard;
