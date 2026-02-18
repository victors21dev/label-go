import Sidebar from "@/app/_components/sidebar";
import { checkUserStatus } from "@/app/_lib/check-user";
import { redirect } from "next/navigation";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await checkUserStatus();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <Sidebar />
      <main className="bg-card flex-1 m-4 p-6 overflow-y-auto rounded-lg">
        {children}
      </main>
    </div>
  );
}
