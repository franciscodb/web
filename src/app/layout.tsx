import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

/**
 * Fuente Inter de Google Fonts
 * Variable font para mejor performance
 */
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

/**
 * Metadata de la aplicación para SEO
 */
export const metadata: Metadata = {
  title: "PrestaChain MX - Préstamos P2P con Blockchain",
  description:
    "Plataforma de préstamos peer-to-peer inclusiva. Tu ENS es tu historial crediticio. Accesible desde Oxxo y SPEI.",
  keywords: [
    "préstamos",
    "P2P",
    "blockchain",
    "DeFi",
    "Arbitrum",
    "ENS",
    "México",
    "inclusión financiera",
  ],
  authors: [{ name: "PrestaChain Team" }],
  openGraph: {
    title: "PrestaChain MX",
    description:
      "Préstamos P2P donde tu ENS es tu historial crediticio, accesible desde Oxxo/SPEI",
    type: "website",
    locale: "es_MX",
  },
  twitter: {
    card: "summary_large_image",
    title: "PrestaChain MX",
    description:
      "Préstamos P2P donde tu ENS es tu historial crediticio, accesible desde Oxxo/SPEI",
  },
};

/**
 * Root Layout Component
 * 
 * Envuelve toda la aplicación con:
 * - Font Inter
 * - Providers (Wagmi, RainbowKit, React Query)
 * - Estilos globales
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es-MX" className={inter.variable}>
      <body className={`${inter.className} antialiased bg-gray-50`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}