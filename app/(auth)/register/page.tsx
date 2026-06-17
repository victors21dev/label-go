"use client";

import { registerAction } from "@/app/_actions/register";
import { getSectors } from "@/app/_actions/get-sectors";
import { Button } from "@/app/_components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/app/_components/ui/card";
import { Input } from "@/app/_components/ui/input";
import { Label } from "@/app/_components/ui/label";
import Link from "next/link";
import { useActionState, useEffect, useState } from "react";
import { motion } from "motion/react";
import { toast } from "sonner";

export default function RegisterPage() {
  const [state, formAction, isPending] = useActionState(registerAction, null);
  const [sectors, setSectors] = useState<{ id: string; name: string }[]>([]);

  // Carregar setores do banco ao montar o componente
  useEffect(() => {
    async function loadSectors() {
      const data = await getSectors();
      setSectors(data);
    }
    loadSectors();
  }, []);

  useEffect(() => {
    if (state?.error) {
      toast.error(state.error);
    }
  }, [state]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="flex w-85 items-center justify-center py-10"
    >
      <Card className="w-full max-w-sm shadow-lg">
        <CardHeader>
          <CardTitle>Registro</CardTitle>
          <CardDescription>
            Crie sua conta preenchendo os dados abaixo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction}>
            <div className="flex flex-col gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Nome Completo</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Victor Santos"
                  required
                  autoComplete="off"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="username">Usuário</Label>
                <Input
                  id="username"
                  name="username"
                  placeholder="victors21dev"
                  required
                  autoComplete="one-time-code"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  autoComplete="off"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  autoComplete="one-time-code"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="sectorId">Setor</Label>
                <select
                  id="sectorId"
                  name="sectorId"
                  required
                  autoComplete="off"
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  <option value="">Selecione um setor</option>
                  {sectors.map((sector) => (
                    <option key={sector.id} value={sector.id}>
                      {sector.name}
                    </option>
                  ))}
                </select>
              </div>

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  type="submit"
                  className="w-full mt-2"
                  disabled={isPending}
                >
                  {isPending ? "Criando conta..." : "Criar Conta"}
                </Button>
              </motion.div>
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <Link href="/login" className="w-full">
            <Button variant="link" className="w-full">
              Já tem conta? Login
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
