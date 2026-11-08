import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Générateur PPT Soutenance — Wijdane & Salma",
  description: "Conception, personnalisation et export de présentations académiques PowerPoint avec l'IA Claude.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className="dark">
      <body className="bg-slate-950 text-slate-100 antialiased">{children}</body>
    </html>
  );
}
