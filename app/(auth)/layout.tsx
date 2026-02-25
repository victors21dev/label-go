import { Toaster } from "sonner";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-muted">
      {children}
      <Toaster richColors position="top-right" />
    </div>
  );
}
