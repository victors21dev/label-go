import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const { pathname } = req.nextUrl;

    // Se for USER, restringir rotas de admin
    if (token?.role === "USER") {
      const userRoutes = ["/", "/labels", "/history", "/sectors"];
      const isAllowed = userRoutes.some(
        (route) => pathname === route || pathname.startsWith(`${route}/`)
      );

      if (!isAllowed) {
        return NextResponse.redirect(new URL("/", req.url));
      }
    }
  },
  {
    callbacks: {
      // Retorna true se houver token, permitindo o acesso à rota
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  // Protege tudo, exceto login, api, pasta public e arquivos do next
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|login|fonts).*)"],
};
