import { services } from "@/lib/data";

export default function ServiceCard({ s }: { s: (typeof services)[number]; i?: number }) {
  return (
    <article
      id={s.slug}
      className="flex h-full flex-col rounded-3xl border border-ink/10 bg-beige p-6 transition hover:shadow-xl"
    >
      <h3 className="font-serif text-2xl leading-snug">{s.name}</h3>
      <p className="mt-2 text-sm leading-relaxed text-ink/70">{s.desc}</p>

      <div className="mt-auto pt-5">
        <div className="flex items-center justify-between text-sm">
          <span className="text-ink/60">⏱ {s.dur}</span>
          <span className="font-medium">{s.price}</span>
        </div>
        <a href={`/reservar?s=${s.slug}`} className="btn-dark mt-4 block w-full text-center">
          Reservar
        </a>
      </div>
    </article>
  );
}
