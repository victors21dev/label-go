import Sidebar from "../_components/sidebar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-full w-full">
      <Sidebar />
      <div className="bg-card w-full m-4 p-6 overflow-y-scroll">{children}</div>
    </div>
  );
}
