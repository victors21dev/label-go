"use client";

import { Button } from "../_components/ui/button";
import { useReactToPrint } from "react-to-print";
import { useRef } from "react";

const Label = () => {
  const contentRef = useRef<HTMLDivElement>(null);
  const reactToPrintFn = useReactToPrint({
    contentRef: contentRef,
  });
  return (
    <div>
      <Button onClick={() => reactToPrintFn()}>Print</Button>
      <div className="w-50 h-25 bg-amber-300" ref={contentRef}>
        <h1>Content to print</h1>
        <p>This section will be printed.</p>
      </div>
    </div>
  );
};

export default Label;
