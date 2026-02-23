import Sidebar from "@/app/_components/sidebar";
import { currentUser } from "@clerk/nextjs/server";
import checkUser from "../_controls/check-user";
import registerUser from "../_controls/register-user";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser();

  if (!user) {
    return <div>Sign in to view this page</div>;
  }

  let userCheckDb = await checkUser({ id: user.id });

  if (!userCheckDb) {
    userCheckDb = await registerUser({
      id: user.id,
      name: `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim(),
      email: user.emailAddresses[0].emailAddress,
      imageUrl: user.imageUrl,
    });
  }
  if (userCheckDb?.status === "UNAUTHORIZED") {
    return (
      <div className="flex h-screen items-center justify-center">
        <h1 className="text-xl font-semibold">
          Aguardando autorização do administrador...
        </h1>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full overflow-hidden p-2">
      <Sidebar />
      <main className="bg-card flex-1 p-6 overflow-y-auto rounded-lg">
        {children}
      </main>
    </div>
  );
}
