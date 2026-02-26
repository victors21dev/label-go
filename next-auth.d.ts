import NextAuth, { DefaultSession } from "next-auth";
import { Role, UserStatus } from "@prisma/client"; // Ajuste conforme seus enums

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: Role;
      status: UserStatus;
    } & DefaultSession["user"];
  }

  interface User {
    role?: Role;
    status?: UserStatus;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: Role;
    status: UserStatus;
  }
}
