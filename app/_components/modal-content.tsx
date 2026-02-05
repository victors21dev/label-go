import { Button } from "./ui/button";

interface ModalContentProps {
  onClose: () => void;
}

export default function ModalContent({ onClose }: ModalContentProps) {
  return (
    <div className="bg-slate-900 border border-slate-800 p-6 rounded-lg shadow-2xl max-w-md w-full mx-4">
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
