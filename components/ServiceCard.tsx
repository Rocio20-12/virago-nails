import Placeholder from "./Placeholder";
import { tones, services } from "@/lib/data";
export default function ServiceCard({ s, i }: { s: (typeof services)[number]; i: number }) {
  return (
    <article id={s.slug} className="group overflow-hidden rounded-3xl border border-ink/5 bg-beige transition hover:shadow-xl">
      <div className="overflow-hidden"><Placeholder tone={tones[i % tones.length]} className="aspect-[4/3] transition duration-700 group-hover:scale-105" label={s.name} /></div>
      <div className="p-6">
        <h3 className="font-serif text-2xl">{s.name}</h3>
        <p className="mt-2 text-sm leading-relaxed text-ink/70">{s.desc}</p>
        <div className="mt-4 flex items-center justify-between text-sm"><span className="text-ink/60">⏱ {s.dur}</span><span className="font-medium">{s.price}</span></div>
        <a href={`/reservar?s=${s.slug}`} className="btn-dark mt-5 w-full">Reservar</a>
      </div>
    </article>
  );
}
