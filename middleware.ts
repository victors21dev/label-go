import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Rotas que não precisam de login
const isPublicRoute = createRouteMatcher([
  "/login(.*)",
  "/register(.*)",
  "/unauthorized(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  if (isPublicRoute(req)) return;
  await auth.protect();
});

export const config = {
  matcher: [
    /*
     * 1. Ignora todos os arquivos internos do Next.js (_next)
     * 2. Ignora arquivos estáticos (imagens, favicons, etc.)
     * 3. Garante que o Turbopack consiga carregar seus chunks (.js)
     */
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
