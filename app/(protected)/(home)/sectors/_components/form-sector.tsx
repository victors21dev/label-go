"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { sectorSchema } from "../../../_schema/schemas";
import { Button } from "@/app/_components/ui/button";
import { createGenericAction } from "@/app/_components/actions";
import { z } from "zod";

// Criamos um tipo específico para este formulário de impressora
type PrinterFormData = z.infer<typeof sectorSchema>;

const Form = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PrinterFormData>({
    resolver: zodResolver(sectorSchema),
  });

  const onSubmit: SubmitHandler<PrinterFormData> = async (data) => {
    const result = await createGenericAction(data, "sector");
    if (result.success) {
      alert("Setor salvo com sucesso!");
      reset();
    } else {
      alert("Erro: " + result.error);
    }
  };

  return (
    <form
      autoComplete="off"
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4"
    >
      {/* Campo setor */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium">Nome setor</label>
        <input
          placeholder="Ex: TI"
          {...register("name")}
          className="border p-2 rounded-md bg-muted text-foreground"
        />
        {errors.name && (
          <span className="text-destructive text-xs">
            {errors.name.message}
          </span>
        )}
      </div>
      {/* Campo coordenador */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium">Coordenador</label>
        <input
          placeholder="Ex: Lira"
          {...register("coordinatorName")}
          className="border p-2 rounded-md bg-muted text-foreground"
        />
        {errors.coordinatorName && (
          <span className="text-destructive text-xs">
            {errors.coordinatorName.message}
          </span>
        )}
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Salvando..." : "Salvar setor"}
      </Button>
    </form>
  );
};

export default Form;
