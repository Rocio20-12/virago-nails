import type { Metadata } from "next";
import ServiceCard from "@/components/ServiceCard";
import { services } from "@/lib/data";
export const metadata: Metadata = { title: "Servicios de manicura y uñas en Rosario", description: "Semipermanente, nail art, soft gel, kapping gel y extensiones en Rosario. Precios, duración y reserva online." };
export default function Page() {
  return (
    <main className="mx-auto max-w-6xl px-5 py-20">
      <p className="eyebrow">Servicios</p><h1 className="h2 mt-2">Cuidado y diseño para tus manos</h1>
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{services.map((s, i) => <ServiceCard key={s.slug} s={s} i={i} />)}</div>
    </main>
  );
}
