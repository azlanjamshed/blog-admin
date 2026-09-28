import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "../context/AuthContext";
import { ToastProvider } from "../context/ToastContext";

export const metadata: Metadata = {
  title: "Paper Studio · Author & Content Management",
  description: "Craft, manage, and publish thoughtful writing for your readers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-zinc-100 text-zinc-900 selection:bg-emerald-200 selection:text-emerald-950 font-sans">
        <ToastProvider>
          <AuthProvider>{children}</AuthProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
