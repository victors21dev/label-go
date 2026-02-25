import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login",
  },
});

// O matcher define em quais rotas o middleware vai agir
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|register).*)"],
};
