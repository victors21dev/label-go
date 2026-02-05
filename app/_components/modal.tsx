import { useState } from "react";
import { createPortal } from "react-dom";
import ModalContent from "./modal-content";
import { Button } from "./ui/button";

const Modal = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Button onClick={() => setShowModal(true)}>
        Show modal using a portal
      </Button>
      {showModal &&
        createPortal(
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <ModalContent onClose={() => setShowModal(false)} />
          </div>,
          document.body
        )}
    </>
  );
};

export default Modal;
