import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const role = req.nextauth.token?.role;
    const { pathname } = req.nextUrl;

    // Rotas permitidas para o usuário comum (USER)
    const userRoutes = ["/", "/labels", "/history", "/sectors"];

    if (role === "USER") {
      const isAllowed = userRoutes.some(
        (route) => pathname === route || pathname.startsWith(`${route}/`)
      );

      if (!isAllowed) {
        // Se tentar acessar /users ou /printers, manda de volta para o dashboard
        return NextResponse.redirect(new URL("/", req.url));
      }
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: [
    "/",
    "/labels/:path*",
    "/history/:path*",
    "/sectors/:path*",
    "/users/:path*",
    "/printers/:path*",
    "/config/:path*",
  ],
  debug: process.env.NODE_ENV === "development",
  pages: {
    signIn: "/login",
    error: "/login",
  },
};
