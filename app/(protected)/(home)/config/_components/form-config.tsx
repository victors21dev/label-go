"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { labelSchema } from "../../../_schema/schemas";
import { Button } from "@/app/_components/ui/button";
import { createGenericAction } from "@/app/_components/actions";
import { z } from "zod";

type LabelFormData = z.infer<typeof labelSchema>;

const Form = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<LabelFormData>({
    // @ts-expect-error – incompatibilidade conhecida entre RHF + Zod (coerce)
    resolver: zodResolver(labelSchema),
  });

  const onSubmit: SubmitHandler<LabelFormData> = async (data) => {
    const result = await createGenericAction(data, "labelModel");
    if (result.success) {
      alert("Configuração salva com sucesso!");
      reset();
    } else {
      alert("Erro: " + result.error);
    }
  };

  return (
    <form
      autoComplete="off"
      // @ts-expect-error – conflito conhecido entre RHF generics e SubmitHandler
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4"
    >
      {/* Campo Nome */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium">Modelo da etiqueta</label>
        <input
          placeholder="Ex: Nome etiqueta"
          {...register("name")}
          className="border p-2 rounded-md bg-muted text-foreground"
        />
        {errors.name && (
          <span className="text-destructive text-xs">
            {errors.name.message}
          </span>
        )}
      </div>
      {/* Largura */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium">Largura (mm)</label>
        <input
          placeholder="Ex: 8,5"
          type="number"
          step="0.01"
          {...register("widthMm")}
          className="border p-2 rounded-md bg-muted text-foreground"
        />
        {errors.widthMm && (
          <span className="text-destructive text-xs">
            {errors.widthMm.message}
          </span>
        )}
      </div>

      {/* Altura */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium">Altura (mm)</label>
        <input
          placeholder="Ex: 4,5"
          type="number"
          step="0.01"
          {...register("heightMm")}
          className="border p-2 rounded-md bg-muted text-foreground"
        />
        {errors.heightMm && (
          <span className="text-destructive text-xs">
            {errors.heightMm.message}
          </span>
        )}
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Salvando..." : "Salvar configuração"}
      </Button>
    </form>
  );
};

export default Form;
