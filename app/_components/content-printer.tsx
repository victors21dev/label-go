"use client";

import { useReactToPrint } from "react-to-print";
import { useRef, useImperativeHandle, forwardRef } from "react";
import React from "react";

interface ContentPrinterProps {
  children: React.ReactNode;
  larguraLabelProps: string;
  alturaLabelProps: string;
}

export interface ContentPrinterRef {
  print: () => void;
}

const ContentPrinter = forwardRef<ContentPrinterRef, ContentPrinterProps>(
  ({ children }, ref) => {
    const contentRef = useRef<HTMLDivElement>(null);

    const reactToPrintFn = useReactToPrint({
      contentRef: contentRef,
    });

    useImperativeHandle(ref, () => ({
      print: () => {
        reactToPrintFn();
      },
    }));

    return <div ref={contentRef}>{children}</div>;
  }
);

ContentPrinter.displayName = "ContentPrinter";

export default ContentPrinter;
