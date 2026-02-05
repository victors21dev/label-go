import { useState } from "react";
import { createPortal } from "react-dom";
import { Button } from "./ui/button";

type ModalProps = {
  title: string;
  children: any;
};

const Modal = ({ title, children }: ModalProps) => {
  const [showModal, setShowModal] = useState(false);

  const handleClose = () => setShowModal(false);

  return (
    <>
      <Button onClick={() => setShowModal(true)}>{title}</Button>
      {showModal &&
        createPortal(
          <div className="fixed bottom-0 left-0 top-0 flex h-screen w-screen items-center justify-center backdrop-blur-sm">
            {children(handleClose)}
          </div>,
          document.body
        )}
    </>
  );
};

export default Modal;
