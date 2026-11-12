import type { Metadata } from "next";
import GalleryGrid from "@/components/GalleryGrid";
export const metadata: Metadata = { title: "Galería de nail art y uñas en Rosario", description: "Mirá nuestros trabajos de nail art, soft gel, kapping y extensiones en Rosario." };
export default function Page() {
  return (
    <main className="mx-auto max-w-6xl px-5 py-20">
      <p className="eyebrow">Galería</p><h1 className="h2 mb-10 mt-2">Inspiración para tu próximo diseño</h1>
      <GalleryGrid />
    </main>
  );
}
