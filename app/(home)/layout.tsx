import Sidebar from "@/app/_components/sidebar";
export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-full overflow-hidden">
      <Sidebar />
      <main className="bg-card flex-1 p-4 overflow-y-auto rounded-lg">
        {children}
      </main>
    </div>
  );
}
