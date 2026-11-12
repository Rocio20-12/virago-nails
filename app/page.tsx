import Link from "next/link";
import Reveal from "@/components/Reveal";
import ServiceCard from "@/components/ServiceCard";
import GalleryGrid from "@/components/GalleryGrid";
import Testimonials from "@/components/Testimonials";
import { benefits, services } from "@/lib/data";
export default function Home() {
  return (
    <main>
      <section className="relative overflow-hidden bg-gradient-to-b from-beige to-nude">
        <div className="absolute -right-24 top-10 h-96 w-96 rounded-full bg-rose/30 blur-3xl" />
        <div className="relative mx-auto max-w-6xl px-5 py-24 md:py-40">
          <Reveal><p className="eyebrow">Nail studio · Rosario</p></Reveal>
          <Reveal delay={0.1}><h1 className="mt-4 max-w-3xl font-serif text-6xl leading-[1.02] md:text-8xl">Uñas que hablan por vos</h1></Reveal>
          <Reveal delay={0.2}><p className="mt-6 max-w-xl text-lg text-ink/70">Manicura profesional, Nail Art y diseños exclusivos en Rosario.</p></Reveal>
          <Reveal delay={0.3} className="mt-10 flex flex-wrap gap-3">
            <a href="/reservar" className="btn-dark">Reservar Turno</a><Link href="/galeria" className="btn-line">Ver Trabajos</Link>
          </Reveal>
          <p className="mt-10 text-sm text-ink/60">★★★★★ Clientas felices · Higiene certificada</p>
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-5 py-24">
        <Reveal><p className="eyebrow">Servicios</p><h2 className="h2 mt-2">Servicios destacados</h2></Reveal>
        <div className="mt-10 grid gap-6 md:grid-cols-3">{services.slice(0, 3).map((s, i) => <Reveal key={s.slug} delay={i * 0.1}><ServiceCard s={s} i={i} /></Reveal>)}</div>
        <div className="mt-10 text-center"><Link href="/servicios" className="btn-line">Ver todos los servicios</Link></div>
      </section>
      <section className="bg-beige py-24"><div className="mx-auto max-w-6xl px-5">
        <Reveal><p className="eyebrow">Galería</p><h2 className="h2 mb-10 mt-2">Nuestros trabajos</h2></Reveal>
        <GalleryGrid limit={6} /><div className="mt-10 text-center"><Link href="/galeria" className="btn-dark">Ver galería completa</Link></div>
      </div></section>
      <section className="mx-auto max-w-6xl px-5 py-24">
        <Reveal><h2 className="h2 mb-12 text-center">Por qué elegir Virago Nails</h2></Reveal>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">{benefits.map(([t, d], i) => <Reveal key={t} delay={i * 0.08}><div className="rounded-2xl border border-ink/10 p-6"><div className="mb-4 h-1 w-8 bg-rose" /><h3 className="font-serif text-xl">{t}</h3><p className="mt-2 text-sm text-ink/70">{d}</p></div></Reveal>)}</div>
      </section>
      <section className="bg-nude px-5 py-24"><Testimonials /></section>
      <section className="bg-ink px-5 py-24 text-center text-white">
        <Reveal><h2 className="h2">Tu próximo set empieza acá</h2><p className="mx-auto mt-4 max-w-md text-white/70">Los turnos se agotan rápido. Reservá el tuyo por WhatsApp en segundos.</p>
        <a href="/reservar" className="btn mt-8 bg-white text-ink hover:bg-rose hover:text-white">Reservar Turno</a></Reveal>
      </section>
    </main>
  );
}
