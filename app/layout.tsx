import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NERY - Notícias Regulatórias",
  description:
    "NERY agrega notícias públicas das agências reguladoras federais com curadoria, filtros e acesso por assinatura."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
