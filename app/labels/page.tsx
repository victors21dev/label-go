"use client";

import { Button } from "../_components/ui/button";
import { useReactToPrint } from "react-to-print";
import { useRef, useState } from "react";
import TitleToPage from "../_components/title-page";
import LabelRefeicao from "../_label-models/refeicao";

const Label = () => {
  const [larguraLabel, setLarguraLabel] = useState("6.2cm");
  const [alturaLabel, setAlturaLabel] = useState("4.8cm");

  const contentRef = useRef<HTMLDivElement>(null);

  const reactToPrintFn = useReactToPrint({
    contentRef: contentRef,
  });

  const convert_mm_to_cm = (mm: number) => {
    let cm = mm / 10;
    console.log(cm);
  };

  const handleLabelGenerator = async (mm: number) => {
    await convert_mm_to_cm(mm);
    await reactToPrintFn();
  };

  return (
    <main className="flex flex-col gap-8">
      <div>
        <TitleToPage title="Etiquetas" description="Gere aqui suas etiquetas" />
      </div>

      <div className="flex gap-2 flex-col">
        <Button className="w-fit" onClick={() => handleLabelGenerator(62)}>
          Print
        </Button>
        <div ref={contentRef}>
          <div
            style={{
              width: larguraLabel,
              height: alturaLabel,
            }}
            className="border p-2 rounded-2xl"
          >
            <LabelRefeicao />
          </div>
        </div>
      </div>
    </main>
  );
};

export default Label;
