"use client";

import { useState, ReactNode } from "react";
import { createPortal } from "react-dom";
import { Button } from "./ui/button";
import { motion, AnimatePresence } from "framer-motion";

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
      {createPortal(
        <AnimatePresence>
          {showModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={close}
                className="absolute inset-0 bg-black/20 backdrop-blur-sm"
              />

              <motion.div
                key="modal-content"
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                transition={{ type: "spring", duration: 0.4, bounce: 0.3 }}
                className="relative z-10"
              >
                {children(close)}
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
};

export default Modal;
