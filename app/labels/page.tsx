"use client";

import { Button } from "../_components/ui/button";
import { useReactToPrint } from "react-to-print";
import { useRef } from "react";
import TitleToPage from "../_components/title-page";

const Label = () => {
  const contentRef = useRef<HTMLDivElement>(null);
  const reactToPrintFn = useReactToPrint({
    contentRef: contentRef,
  });
  return (
    <main>
      <div>
        <TitleToPage title="Etiquetas" description="Gere aqui suas etiquetas" />
      </div>
      <div className="hidden">
        <Button onClick={() => reactToPrintFn()}>Print</Button>
        <div className="w-50 h-25 bg-amber-300" ref={contentRef}>
          <h1>Content to print</h1>
          <p>This section will be printed.</p>
        </div>
      </div>
    </main>
  );
};

export default Label;
