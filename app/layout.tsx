import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap"
});

export const metadata: Metadata = {
  title: "NERY - Foundational Software of Tomorrow",
  description:
    "NERY builds foundational software and intelligence portals for regulation and sanitation in Brazil."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
