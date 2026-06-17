"use client";

import { ReactNode } from "react";
import { motion } from "motion/react";
import { Button } from "./ui/button";
import { X } from "lucide-react";

interface ModalContentProps {
  onClose: () => void;
  children: ReactNode;
  title: string;
}

export default function ModalContent({
  onClose,
  children,
  title,
}: ModalContentProps) {
  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.95, opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="flex flex-col gap-0 bg-card rounded-2xl shadow-xl border min-w-90 max-w-md overflow-hidden"
    >
      <div className="flex items-center justify-between px-6 py-4 border-b">
        <h2 className="text-lg font-semibold">{title}</h2>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onClose}
          className="h-8 w-8 rounded-full flex items-center justify-center text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
        >
          <X size={16} />
        </motion.button>
      </div>
      <div className="px-6 py-5">{children}</div>
      <div className="flex justify-end px-6 py-4 border-t bg-muted/30">
        <Button onClick={onClose} variant="outline" size="sm">
          Fechar
        </Button>
      </div>
    </motion.div>
  );
}
