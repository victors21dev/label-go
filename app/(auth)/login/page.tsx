"use client";

import { useState, useTransition } from "react"; // Mudamos para useTransition para o loading
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { Button } from "@/app/_components/ui/button";
import { Input } from "@/app/_components/ui/input";
import { Label } from "@/app/_components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/_components/ui/card";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  async function handleSubmit(formData: FormData) {
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    startTransition(async () => {
      // O "credentials" deve ser o mesmo ID definido no route.ts do NextAuth
      const result = await signIn("credentials", {
        username,
        password,
        redirect: false, // Falso para podermos tratar o erro com Toast
      });

      if (result?.error) {
        toast.error("Usuário ou senha inválidos");
      } else {
        toast.success("Login realizado com sucesso!");
        router.push("/");
        router.refresh(); // Garante que o middleware perceba a nova sessão
      }
    });
  }

  return (
    <div className="flex w-85 items-center justify-center">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Login na sua conta</CardTitle>
          <CardDescription>Entre com seu usuário e senha</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Usamos a action nativa do formulário */}
          <form action={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="username">Usuário</Label>
                <Input
                  id="username"
                  name="username"
                  required
                  placeholder="victors21dev"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Senha</Label>
                <Input id="password" name="password" type="password" required />
              </div>
              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? "Carregando..." : "Entrar"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
