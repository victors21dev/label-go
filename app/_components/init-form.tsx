"use client";

import Modal from "@/app/_components/modal";
import ModalContent from "@/app/_components/modal-content";
import { ReactNode } from "react";

interface InitFormProps {
  children: ReactNode;
  title: string;
  title_button: ReactNode;
}

const InitForm = ({ children, title, title_button }: InitFormProps) => {
  return (
    <div>
      <Modal title={title_button}>
        {(close) => (
          <ModalContent title={title} onClose={close}>
            {children}
          </ModalContent>
        )}
      </Modal>
    </div>
  );
};

export default InitForm;
