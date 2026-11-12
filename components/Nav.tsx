"use client";
import Link from "next/link";
import { useState } from "react";

const links = [["/servicios", "Servicios"], ["/galeria", "Galería"], ["/nosotros", "Nosotros"], ["/contacto", "Contacto"]];
export default function Nav() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-ink/5 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <Link href="/" className="font-serif text-2xl tracking-[.15em]">VIRAGO</Link>
        <nav className="hidden items-center gap-8 text-sm md:flex">
          {links.map(([h, l]) => <Link key={h} href={h} className="hover:text-rose transition">{l}</Link>)}
          <a href="/reservar" className="btn-dark !py-2.5">Reservar turno</a>
        </nav>
        <button className="md:hidden" aria-label="Menú" onClick={() => setOpen(!open)}>
          <span className="mb-1.5 block h-0.5 w-6 bg-ink" /><span className="block h-0.5 w-6 bg-ink" />
        </button>
      </div>
      {open && (
        <nav className="flex flex-col gap-4 border-t border-ink/5 bg-white px-5 py-6 md:hidden">
          {links.map(([h, l]) => <Link key={h} href={h} onClick={() => setOpen(false)} className="text-lg">{l}</Link>)}
          <a href="/reservar" className="btn-dark">Reservar turno</a>
        </nav>
      )}
    </header>
  );
}
