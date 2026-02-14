import Sidebar from "@/app/_components/sidebar";
import { checkUserStatus } from "@/app/_lib/check-status";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await checkUserStatus();

  return (
    <div className="flex h-full w-full">
      <Sidebar />
      <div className="bg-card w-full m-4 p-6 overflow-y-scroll">{children}</div>
    </div>
  );
}
