import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Wijdane LAAGUIDI Hakma La Zone | Master's Thesis Defense 2026",
  description:
    "Wijdane LAAGUIDI Hakma La Zone — Integrated Supply-Chain Coordination Framework · Mercedes-Benz VAN Program · Kromberg & Schubert Plant K3 · Powered by Claude Opus.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className="dark">
      <body className="bg-[#050811] text-slate-100 antialiased selection:bg-amber-500 selection:text-slate-950">
        {children}
      </body>
    </html>
  );
}
