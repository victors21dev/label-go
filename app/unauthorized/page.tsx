"use client"; // Necessário para usar o signOut

import { Lock, LogOut } from "lucide-react";
import { Button } from "@/app/_components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/app/_components/ui/card";
import Link from "next/link";
import { signOut } from "next-auth/react";

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/50 p-4">
      <Card className="w-full max-w-md border-2">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
            <Lock className="h-6 w-6 text-destructive" />
          </div>
          <CardTitle className="text-2xl font-bold">Acesso Restrito</CardTitle>
          <CardDescription>
            Sua conta ainda não foi autorizada por um administrador.
          </CardDescription>
        </CardHeader>

        <CardContent className="text-center text-sm text-muted-foreground">
          <p>
            Para acessar o sistema, você precisa ter o status{" "}
            <strong className="text-foreground">"ACTIVE"</strong>. Entre em
            contato com o suporte ou aguarde a liberação do seu perfil.
          </p>
        </CardContent>

        <CardFooter className="flex flex-col gap-2">
          {/* Botão para deslogar */}
          <Button
            className="w-full gap-2 cursor-pointer"
            onClick={() => signOut({ callbackUrl: "/login" })}
          >
            <LogOut className="h-4 w-4" />
            Sair desta conta
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
