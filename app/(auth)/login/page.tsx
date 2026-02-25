"use client";

import { useTransition } from "react";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { Button } from "@/app/_components/ui/button";
import { Input } from "@/app/_components/ui/input";
import { Label } from "@/app/_components/ui/label";
import {
  Card,
  CardAction,
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

  async function handleSubmit(formData: FormData) {
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    startTransition(async () => {
      const result = await signIn("credentials", {
        username,
        password,
        redirect: false,
      });

      if (result?.error) {
        toast.error("Usuário ou senha inválidos");
      } else {
        toast.success("Login realizado com sucesso!");
        router.push("/");
        router.refresh();
      }
    });
  }

  return (
    <div className="flex w-85 items-center justify-center">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Login na sua conta</CardTitle>
          <CardDescription>Entre com seu usuário e senha</CardDescription>
          <CardAction>
            <Link href="/register" passHref>
              <Button className="cursor-pointer" variant="link">
                Novo? Registre-se
              </Button>
            </Link>
          </CardAction>
        </CardHeader>

        <CardContent>
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
