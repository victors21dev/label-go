"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { labelSchema } from "@/app/_schema/schemas";
import { motion } from "motion/react";
import { Button } from "@/app/_components/ui/button";
import { Input } from "@/app/_components/ui/input";
import { Label } from "@/app/_components/ui/label";
import { createGenericAction } from "@/app/_components/actions";
import { z } from "zod";
import { toast } from "sonner";

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
      toast.success("Configuração salva com sucesso!");
      reset();
    } else {
      toast.error("Erro: " + result.error);
    }
  };

  return (
    <form
      autoComplete="off"
      // @ts-expect-error – conflito conhecido entre RHF generics e SubmitHandler
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-5"
    >
      <div className="grid gap-2">
        <Label htmlFor="name">Modelo da etiqueta</Label>
        <Input
          id="name"
          placeholder="Ex: Nome etiqueta"
          {...register("name")}
        />
        {errors.name && (
          <span className="text-destructive text-xs">{errors.name.message}</span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="widthMm">Largura (mm)</Label>
          <Input
            id="widthMm"
            placeholder="Ex: 8,5"
            type="number"
            step="0.01"
            {...register("widthMm")}
          />
          {errors.widthMm && (
            <span className="text-destructive text-xs">{errors.widthMm.message}</span>
          )}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="heightMm">Altura (mm)</Label>
          <Input
            id="heightMm"
            placeholder="Ex: 4,5"
            type="number"
            step="0.01"
            {...register("heightMm")}
          />
          {errors.heightMm && (
            <span className="text-destructive text-xs">{errors.heightMm.message}</span>
          )}
        </div>
      </div>

      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? "Salvando..." : "Salvar configuração"}
        </Button>
      </motion.div>
    </form>
  );
};

export default Form;
