// proxy.ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Defina as rotas que NÃO precisam de autenticação
const isPublicRoute = createRouteMatcher([
  "/login(.*)",
  "/cadastro(.*)",
  "/unauthorized(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();

  // 1. Se o usuário NÃO está logado e tenta acessar algo privado -> Vai para Login
  if (!userId && !isPublicRoute(req)) {
    return (await auth()).redirectToSignIn();
  }

  // 2. Se o usuário ESTÁ logado e tenta acessar o Login -> Vai para Home
  // Isso evita o loop de ficar preso na tela de login já estando autenticado
  if (
    userId &&
    isPublicRoute(req) &&
    !req.nextUrl.pathname.startsWith("/unauthorized")
  ) {
    return Response.redirect(new URL("/", req.url));
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
