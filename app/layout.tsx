import type { Metadata } from "next";
import { Inter, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import WhatsAppFab from "@/components/WhatsAppFab";
const sans = Inter({ subsets: ["latin"], variable: "--font-sans" });
const serif = Cormorant_Garamond({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-serif" });
const url = "https://viragonails.com.ar"; // TODO: dominio real
export const metadata: Metadata = {
  metadataBase: new URL(url),
  title: { default: "Virago Nails | Manicura y Nail Art en Rosario", template: "%s | Virago Nails Rosario" },
  description: "Manicura profesional en Rosario: uñas semipermanentes, nail art, soft gel, kapping gel y extensiones. Reservá tu turno online.",
  keywords: ["manicura rosario", "uñas rosario", "nail art rosario", "kapping rosario", "soft gel rosario"],
  openGraph: { type: "website", locale: "es_AR", siteName: "Virago Nails", title: "Virago Nails | Uñas que hablan por vos" },
};
const jsonLd = { "@context": "https://schema.org", "@type": "NailSalon", name: "Virago Nails", address: { "@type": "PostalAddress", addressLocality: "Rosario", addressRegion: "Santa Fe", addressCountry: "AR" }, url };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-AR" className={`${sans.variable} ${serif.variable}`}>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <Nav />{children}<Footer /><WhatsAppFab />
      </body>
    </html>
  );
}
