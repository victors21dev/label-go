"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { printerSchema } from "@/app/_schema/schemas";
import { motion } from "motion/react";
import { Button } from "@/app/_components/ui/button";
import { Input } from "@/app/_components/ui/input";
import { Label } from "@/app/_components/ui/label";
import { createGenericAction } from "@/app/_components/actions";
import { z } from "zod";
import { toast } from "sonner";

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
      toast.success("Impressora salva com sucesso!");
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
        <Label htmlFor="brand">Marca</Label>
        <Input id="brand" placeholder="Ex: Epson" {...register("brand")} />
        {errors.brand && (
          <span className="text-destructive text-xs">{errors.brand.message}</span>
        )}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="model">Modelo</Label>
        <Input id="model" placeholder="Ex: L5290" {...register("model")} />
        {errors.model && (
          <span className="text-destructive text-xs">{errors.model.message}</span>
        )}
      </div>

      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? "Salvando..." : "Salvar impressora"}
        </Button>
      </motion.div>
    </form>
  );
};

export default Form;
