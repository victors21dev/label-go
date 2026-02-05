"use client";

import { ReactNode } from "react";
import { Button } from "./ui/button";

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
    <div className="flex flex-col gap-4 p-4 border-2 rounded-2xl bg-card">
      <h2 className="text-xl font-semibold text-foreground">{title}</h2>
      <hr />
      {children}
      <hr />
      <div className="flex justify-end">
        <Button onClick={onClose} variant="outline">
          Fechar
        </Button>
      </div>
    </div>
  );
}
