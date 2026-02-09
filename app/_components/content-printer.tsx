"use client";

import { Button } from "../_components/ui/button";
import { useReactToPrint } from "react-to-print";
import { useRef } from "react";
import React from "react";

interface ContentPrinterProps {
  children: React.ReactNode;
  larguraLabelProps: string;
  alturaLabelProps: string;
}

const ContentPrinter = ({
  children,
  larguraLabelProps,
  alturaLabelProps,
}: ContentPrinterProps) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const reactToPrintFn = useReactToPrint({
    contentRef: contentRef,
  });

  const handleLabelGenerator = async () => {
    await reactToPrintFn();
  };

  return (
    <div>
      <div className="flex gap-2 flex-col">
        <Button className="w-fit" onClick={handleLabelGenerator}>
          Print
        </Button>
        <div ref={contentRef}>
          <div>{children}</div>
        </div>
      </div>
    </div>
  );
};

export default ContentPrinter;
