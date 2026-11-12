import type { Metadata } from "next";
import { ADDRESS, INSTAGRAM, waLink } from "@/lib/data";
export const metadata: Metadata = { title: "Contacto y turnos | Virago Nails Rosario", description: "Reservá tu turno por WhatsApp. Ubicación, horarios e Instagram de Virago Nails en Rosario." };
export default function Page() {
  return (
    <main className="mx-auto max-w-6xl px-5 py-20">
      <p className="eyebrow">Contacto</p><h1 className="h2 mt-2">Reservá tu turno</h1>
      <div className="mt-12 grid gap-10 md:grid-cols-2">
        <div className="space-y-6">
          <a href="/reservar" className="btn-dark w-full">Reservar online</a>
          <a href={waLink()} className="btn-line w-full">Escribinos por WhatsApp</a>
          <a href={INSTAGRAM} className="btn-line w-full">Seguinos en Instagram</a>
          <div className="rounded-2xl bg-beige p-6 text-sm leading-7"><p className="font-medium">Dirección</p><p>{ADDRESS}</p><p className="mt-4 font-medium">Horarios</p><p>Lunes a Viernes: 10 a 20 hs<br />Sábados: 10 a 16 hs</p></div>
        </div>
        <iframe title="Mapa Virago Nails" loading="lazy" className="h-96 w-full rounded-3xl border-0" src="https://www.google.com/maps?q=Rosario,Santa+Fe,Argentina&output=embed" />
      </div>
    </main>
  );
}
