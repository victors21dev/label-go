"use client";

import { Button } from "../_components/ui/button";
import { useReactToPrint } from "react-to-print";
import { useRef, useState } from "react";
import TitleToPage from "../_components/title-page";
import Modal from "../_components/modal";
import ModalContent from "../_components/modal-content";
import QRCode from "react-qr-code";

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
            <div className="flex flex-col w-full h-full gap-4">
              <div className="font-bold justify-center text-center">
                Etiqueta de Refeição
              </div>
              <div className="relative">
                <div
                  className="flex items-center justify-between w-full"
                  style={{
                    border: "none",
                    borderTop: "3px dotted #333",
                    height: "0",
                  }}
                ></div>
                <div className="relative">
                  <div className="flex flex-col h-full justify-center">QR</div>
                  <div className="flex flex-col h-full justify-center">
                    <div>Setor: </div>
                    <div>Val.: </div>
                    <div></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            style={{
              width: larguraLabel,
              height: alturaLabel,
            }}
            className="border p-2 rounded-2xl"
          >
            <div className="flex flex-col w-full h-full gap-4">
              <div className="font-bold justify-center text-center">
                Etiqueta de Refeição
              </div>
              <div className="relative">
                <div
                  className="flex items-center justify-between w-full"
                  style={{
                    border: "none",
                    borderTop: "3px dotted #333",
                    height: "0",
                  }}
                ></div>
                <div className="relative">
                  <div className="flex flex-col h-full justify-center">QR</div>
                  <div className="flex flex-col h-full justify-center">
                    <div>Setor: </div>
                    <div>Val.: </div>
                    <div></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <Modal title="Mostrar">
          {(close: any) => <ModalContent onClose={close} />}
        </Modal>
      </div>
      <div>
        <QRCode value="hey" />
      </div>
    </main>
  );
};

export default Label;
