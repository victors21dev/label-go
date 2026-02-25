import { Button } from "@/app/_components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/app/_components/ui/card";
import { Input } from "@/app/_components/ui/input";
import { Label } from "@/app/_components/ui/label";

export default function LoginPage() {
  return (
    <div className="flex w-85 items-center justify-center">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Login na sua conta</CardTitle>
          <CardDescription>
            Entre com seu usuário e senha para acessar a aplicação
          </CardDescription>
          <CardAction>
            <Button variant="link" className="cursor-pointer">
              Novo Cadastrar
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <form>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Usuário</Label>
                <Input
                  id="user"
                  type="text"
                  placeholder="victors21dev"
                  required
                  autoComplete="none"
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Esqueceu a senha?
                  </a>
                </div>
                <Input id="password" type="password" required />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Button type="submit" className="w-full bg-primary cursor-pointer">
            Entrar
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
