"use client";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { configFormSchema, ConfigFormData } from "../schema/schemas";
import { Button } from "@/app/_components/ui/button";
import { createGenericAction } from "@/app/_controls/actions";

const Form = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ConfigFormData>({
    // @ts-expect-error – incompatibilidade conhecida entre RHF + Zod (coerce)
    resolver: zodResolver<ConfigFormData>(configFormSchema),
  });

  const onSubmit: SubmitHandler<ConfigFormData> = async (data) => {
    const result = await createGenericAction(data, "labelModel");

    if (result.success) {
      alert("Configuração adicionada com sucesso!");
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
      className="flex flex-col gap-4 max-w-md border p-4 rounded-lg"
    >
      {/* Nome */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium">Nome</label>
        <input
          placeholder="Ex: Teste"
          type="text"
          {...register("name")}
          className="border p-2 rounded-md bg-slate-800 text-white"
        />
        {errors.name && (
          <span className="text-red-500 text-xs">{errors.name.message}</span>
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
          className="border p-2 rounded-md bg-slate-800 text-white"
        />
        {errors.widthMm && (
          <span className="text-red-500 text-xs">{errors.widthMm.message}</span>
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
          className="border p-2 rounded-md bg-slate-800 text-white"
        />
        {errors.heightMm && (
          <span className="text-red-500 text-xs">
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
