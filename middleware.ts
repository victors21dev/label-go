import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const { pathname } = req.nextUrl;

    // Se o usuário está logado e tenta acessar rotas de "convidado"
    const isAuthPage =
      pathname.startsWith("/login") ||
      pathname.startsWith("/register") ||
      pathname.startsWith("/unauthorized");

    if (token && isAuthPage) {
      // Redireciona para a home (página principal do sistema)
      return NextResponse.redirect(new URL("/", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      // O middleware só será executado se authorized retornar true
      // Aqui permitimos que ele sempre execute para podermos fazer a lógica manual acima
      authorized: () => true,
    },
  }
);

export const config = {
  matcher: [
    /*
     * Match em todas as rotas exceto:
     * 1. /api (rotas de API)
     * 2. /_next/static (arquivos estáticos)
     * 3. /_next/image (otimização de imagens)
     * 4. /favicon.ico (ícone)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
