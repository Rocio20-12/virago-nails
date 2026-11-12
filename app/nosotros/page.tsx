import type { Metadata } from "next";
import Reveal from "@/components/Reveal";
import Placeholder from "@/components/Placeholder";
import { tones } from "@/lib/data";
export const metadata: Metadata = { title: "Sobre Virago Nails | Manicura en Rosario", description: "Conocé nuestra historia, materiales premium y protocolos de higiene." };
const blocks = [["Nuestra historia", "Virago nació de la pasión por el detalle: un espacio en Rosario donde cada manicura se trata como una pieza de diseño personalizada."],
  ["Materiales de calidad", "Trabajamos con geles, esmaltes y limas profesionales de primeras marcas, elegidos por su durabilidad y el cuidado de la uña natural."],
  ["Protocolos de higiene", "Esterilización de instrumental, material descartable por clienta y superficies desinfectadas en cada turno."],
  ["Atención personalizada", "Turnos con tiempo, asesoramiento sincero y resultados pensados para tu estilo de vida."]];
export default function Page() {
  return (
    <main className="mx-auto max-w-6xl px-5 py-20">
      <p className="eyebrow">Sobre nosotros</p><h1 className="h2 mt-2">Diseño, calidad y confianza</h1>
      <div className="mt-12 grid items-center gap-12 md:grid-cols-2">
        <Placeholder tone={tones[0]} className="aspect-[4/5] rounded-3xl" />
        <div className="space-y-8">{blocks.map(([t, d], i) => <Reveal key={t} delay={i * 0.08}><h2 className="font-serif text-2xl">{t}</h2><p className="mt-2 text-ink/70">{d}</p></Reveal>)}</div>
      </div>
    </main>
  );
}
