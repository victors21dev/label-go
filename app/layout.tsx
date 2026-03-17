import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "./_components/theme-provider";
import { AuthProvider } from "./_components/session-provider";

const fontlocal = localFont({
  src: "../public/Inter_18pt-Regular.ttf",
  display: "swap",
});

export const metadata: Metadata = {
  title: "LabelGO",
  description: "Etiquetas",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-br" suppressHydrationWarning>
      <body
        className={`${fontlocal.className} antialiased bg-muted w-full h-full`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
