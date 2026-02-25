import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./_components/theme-provider";
import { AuthProvider } from "./_components/session-provider";
// import { ClerkProvider } from "@clerk/nextjs";

const inter = Inter({
  subsets: ["latin"],
  display: "auto",
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
      <body className={`${inter.className} antialiased bg-muted w-full h-full`}>
        {/* <ClerkProvider> */}
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
        {/* </ClerkProvider> */}
      </body>
    </html>
  );
}
