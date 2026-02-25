import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const { pathname } = req.nextUrl;

    // 1. Se o usuário ESTÁ logado
    if (token) {
      const isUnauthorizedUser = token.status === "UNAUTHORIZED";

      // Regra: Usuário UNAUTHORIZED só pode ver a página /unauthorized
      if (isUnauthorizedUser && pathname !== "/unauthorized") {
        return NextResponse.redirect(new URL("/unauthorized", req.url));
      }

      // Regra: Usuário ATIVO não pode ver Login, Register ou Unauthorized
      const isAuthPage =
        pathname === "/login" ||
        pathname === "/register" ||
        pathname === "/unauthorized";

      if (!isUnauthorizedUser && isAuthPage) {
        return NextResponse.redirect(new URL("/", req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;

        // Rotas que qualquer pessoa (logada ou não) pode acessar
        if (pathname === "/login" || pathname === "/register") {
          return true;
        }

        // Para qualquer outra rota (/, /sectors, /unauthorized), precisa de token
        return !!token;
      },
    },
    pages: {
      signIn: "/login",
    },
  }
);

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
