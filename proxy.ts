import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const { pathname } = req.nextUrl;

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
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/login",
    },
  }
);

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|login|fonts).*)"],
};
