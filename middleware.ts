// middleware.ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/login(.*)",
  "/cadastro(.*)",
  "/unauthorized(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  const userId = await auth();

  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/_next")) {
    return NextResponse.next();
  }

  if (pathname.includes(".")) {
    return NextResponse.next();
  }

  if (!userId && !isPublicRoute(req)) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next).*)"],
};
