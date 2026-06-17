"use client";

import { useTransition } from "react";
import { motion } from "motion/react";
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
import Link from "next/link";

export default function LoginPage() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  // Alterado para receber o FormData corretamente
  async function handleFormSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    startTransition(async () => {
      try {
        const result = await signIn("credentials", {
          username,
          password,
          redirect: false,
        });

        if (result?.error) {
          // O NextAuth retorna erros específicos, aqui tratamos de forma genérica
          toast.error("Usuário ou senha inválidos");
        } else {
          toast.success("Login realizado com sucesso!");

          // Refresh garante que o Middleware e o Layout vejam a nova sessão
          router.push("/");
          router.refresh();
        }
      } catch (error) {
        toast.error("Ocorreu um erro inesperado");
      }
    });
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="flex min-h-screen w-full items-center justify-center p-4"
    >
      <Card className="w-full max-w-sm shadow-lg">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl">Login</CardTitle>
            <Link href="/register">
              <Button variant="link" className="px-0 font-normal">
                Novo? Registre-se
              </Button>
            </Link>
          </div>
          <CardDescription>
            Entre com seu usuário e senha para acessar o LabelGO
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleFormSubmit}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="username">Usuário</Label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  required
                  placeholder="seu_usuario"
                  disabled={isPending}
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Senha</Label>
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  disabled={isPending}
                />
              </div>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button type="submit" className="w-full" disabled={isPending}>
                  {isPending ? "Autenticando..." : "Entrar"}
                </Button>
              </motion.div>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
