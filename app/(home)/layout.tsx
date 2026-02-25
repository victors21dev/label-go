import Sidebar from "@/app/_components/sidebar";
// import { currentUser } from "@clerk/nextjs/server";
// import checkUser from "../_controls/check-user";
// import registerUser from "../_controls/register-user";
// import { SyncUserStorage } from "../_components/sync-user-storage";
// import { redirect } from "next/navigation";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // // 1. Busca no Clerk (Sempre necessário para segurança no servidor)
  // const user = await currentUser();
  // if (!user) redirect("/login");

  // // 2. Busca no Banco (Otimizado pelo cache do React)
  // let userCheckDb = await checkUser({ id: user.id });

  // // 3. Cadastro se não existir
  // if (!userCheckDb) {
  //   userCheckDb = await registerUser({
  //     id: user.id,
  //     name: `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim(),
  //     email: user.emailAddresses[0].emailAddress,
  //     imageUrl: user.imageUrl,
  //   });
  // }

  // // 4. Bloqueio por status
  // if (userCheckDb?.status === "UNAUTHORIZED") {
  //   return (
  //     <div className="flex h-screen items-center justify-center">
  //       <h1 className="text-xl font-semibold">Aguardando autorização...</h1>
  //     </div>
  //   );
  // }

  return (
    <div className="flex h-screen w-full overflow-hidden p-2">
      {/* Esse componente vai salvar os dados no localStorage do navegador */}
      {/* <SyncUserStorage userData={userCheckDb} /> */}

      <Sidebar />
      <main className="bg-card flex-1 p-6 overflow-y-auto rounded-lg">
        {children}
      </main>
    </div>
  );
}
