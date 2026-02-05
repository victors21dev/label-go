import { Button } from "./ui/button";

interface ModalContentProps {
  onClose: () => void;
}

export default function ModalContent({ onClose }: ModalContentProps) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 text-white">
        Configurações de Etiqueta
      </h2>
      <p className="text-slate-400 mb-6">I'm a modal dialog</p>

      <div className="flex justify-end">
        <Button onClick={onClose} variant="outline">
          Close
        </Button>
      </div>
    </div>
  );
}
