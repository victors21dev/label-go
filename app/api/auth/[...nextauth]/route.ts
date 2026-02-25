import { db } from "@/app/_lib/prisma";
import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          throw new Error("Dados de login necessários");
        }

        const user = await db.user.findUnique({
          where: { username: credentials.username },
        });

        if (!user || !user.password) {
          throw new Error("Usuário não encontrado");
        }

        const passwordMatch = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!passwordMatch) {
          throw new Error("Senha incorreta");
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role, // Adicionando o role do seu schema
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    // Passa o ID e o Role para o token JWT
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
        token.id = user.id;
      }
      return token;
    },
    // Passa o ID e o Role para a Sessão que o Frontend lê
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
        (session.user as any).id = token.id;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login", // Redireciona para sua página customizada
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
