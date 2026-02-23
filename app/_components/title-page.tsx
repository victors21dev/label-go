"use client"; // Obrigatório para usar hooks de estado

import { useState, useEffect } from "react";
import { UserButton } from "@clerk/nextjs";

type TitleToPageProps = {
  title: string;
  description: string;
};

const TitleToPage = ({ title, description }: TitleToPageProps) => {
  const [mounted, setMounted] = useState(false);

  // O useEffect só roda no lado do cliente
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="w-full flex justify-between items-center">
      <div>
        <div className="text-lg font-bold">{title}</div>
        <div className="text-sm text-muted-foreground">{description}</div>
      </div>
      <div className="flex items-center">
        {/* Renderiza um esqueleto ou espaço vazio até o cliente estar pronto */}
        {mounted ? (
          <UserButton afterSignOutUrl="/" />
        ) : (
          <div className="h-8 w-8 animate-pulse bg-muted rounded-full" />
        )}
      </div>
    </header>
  );
};

export default TitleToPage;
