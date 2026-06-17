"use client";

import { useState, ReactNode, useEffect } from "react";
import { createPortal } from "react-dom";
import { Button } from "./ui/button";
import { motion, AnimatePresence } from "motion/react";

type ModalProps = {
  title: ReactNode;
  children: (close: () => void) => ReactNode;
};

const Modal = ({ title, children }: ModalProps) => {
  const [showModal, setShowModal] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const close = () => setShowModal(false);

  if (!mounted)
    return <Button onClick={() => setShowModal(true)}>{title}</Button>;

  return (
    <>
      <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
        <Button
          className="bg-chart-2 hover:bg-chart-3 cursor-pointer shadow-sm hover:shadow-md transition-shadow"
          onClick={() => setShowModal(true)}
        >
          {title}
        </Button>
      </motion.div>

      {showModal &&
        createPortal(
          <AnimatePresence mode="wait">
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
                className="relative z-10"
              >
                {children(close)}
              </motion.div>
            </div>
          </AnimatePresence>,
          document.body
        )}
    </>
  );
};

export default Modal;
