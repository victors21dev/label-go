"use client";

import { useState, ReactNode } from "react";
import { createPortal } from "react-dom";
import { Button } from "./ui/button";

type ModalProps = {
  title: ReactNode;
  children: (close: () => void) => ReactNode;
};

const Modal = ({ title, children }: ModalProps) => {
  const [showModal, setShowModal] = useState(false);

  const close = () => setShowModal(false);

  return (
    <>
      <Button onClick={() => setShowModal(true)}>{title}</Button>
      {showModal &&
        createPortal(
          <div className="fixed bottom-0 left-0 top-0 flex h-screen w-screen items-center justify-center backdrop-blur-sm">
            {children(close)}
          </div>,
          document.body
        )}
    </>
  );
};

export default Modal;
