"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { sectorSchema } from "@/app/_schema/schemas";
import { motion } from "motion/react";
import { Button } from "@/app/_components/ui/button";
import { Input } from "@/app/_components/ui/input";
import { Label } from "@/app/_components/ui/label";
import { createGenericAction } from "@/app/_components/actions";
import { z } from "zod";
import { toast } from "sonner";

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
      toast.success("Setor salvo com sucesso!");
      reset();
    } else {
      toast.error("Erro: " + result.error);
    }
  };

  return (
    <form
      autoComplete="off"
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-5"
    >
      <div className="grid gap-2">
        <Label htmlFor="name">Nome do setor</Label>
        <Input id="name" placeholder="Ex: TI" {...register("name")} />
        {errors.name && (
          <span className="text-destructive text-xs">{errors.name.message}</span>
        )}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="coordinatorName">Coordenador(a)</Label>
        <Input
          id="coordinatorName"
          placeholder="Ex: Lira"
          {...register("coordinatorName")}
        />
        {errors.coordinatorName && (
          <span className="text-destructive text-xs">{errors.coordinatorName.message}</span>
        )}
      </div>

      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? "Salvando..." : "Salvar setor"}
        </Button>
      </motion.div>
    </form>
  );
};

export default Form;
