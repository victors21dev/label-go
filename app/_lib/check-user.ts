// import { auth, currentUser } from "@clerk/nextjs/server";
// import { db } from "./prisma";

// type CheckUserResult =
//   | {
//       id: string;
//       status: "AUTHORIZED" | "UNAUTHORIZED";
//       role: "USER" | "ADMIN";
//       name: string;
//       imageUrl: string | null;
//     }
//   | "UNAUTHORIZED"
//   | null;

// export async function checkUserStatus(): Promise<CheckUserResult> {
//   const authData = await auth();
//   const userId = authData.userId;

//   // Se chegou aqui sem userId, middleware não protegeu (ou rota pública)
//   if (!userId) return null;

//   let user = await db.user.findUnique({
//     where: { id: userId },
//   });

//   // Cria o usuário na primeira vez que ele logar
//   if (!user) {
//     const user_current = await currentUser();
//     if (!user_current) return null;

//     user = await db.user.create({
//       data: {
//         id: userId,
//         status: "UNAUTHORIZED",
//         role: "USER",
//         name:
//           `${user_current.firstName ?? ""} ${
//             user_current.lastName ?? ""
//           }`.trim() || "Usuário",
//         imageUrl: user_current.imageUrl ?? null,
//       },
//     });
//   }

//   // Regra de autorização da sua app
//   if (user.status === "UNAUTHORIZED") {
//     return "UNAUTHORIZED";
//   }

//   return user;
// }
