"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { printerSchema } from "../../../_schema/schemas";
import { Button } from "@/app/_components/ui/button";
import { createGenericAction } from "@/app/_components/actions";
import { z } from "zod";

// Criamos um tipo específico para este formulário de impressora
type PrinterFormData = z.infer<typeof printerSchema>;

const Form = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PrinterFormData>({
    resolver: zodResolver(printerSchema),
  });

  const onSubmit: SubmitHandler<PrinterFormData> = async (data) => {
    const result = await createGenericAction(data, "printer");
    if (result.success) {
      alert("Impressora salva com sucesso!");
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
      {/* Campo Nome */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium">Marca</label>
        <input
          placeholder="Ex: Epson"
          {...register("brand")}
          className="border p-2 rounded-md bg-muted text-foreground"
        />
        {errors.brand && (
          <span className="text-destructive text-xs">
            {errors.brand.message}
          </span>
        )}
      </div>

      {/* Campo Modelo */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium">Modelo</label>
        <input
          placeholder="Ex: L5290"
          {...register("model")}
          className="border p-2 rounded-md bg-muted text-foreground"
        />
        {errors.model && (
          <span className="text-destructive text-xs">
            {errors.model.message}
          </span>
        )}
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Salvando..." : "Salvar impressora"}
      </Button>
    </form>
  );
};

export default Form;
