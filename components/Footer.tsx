import Link from "next/link";
import { ADDRESS, INSTAGRAM, waLink } from "@/lib/data";
export default function Footer() {
  return (
    <footer className="bg-ink text-white/80">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 md:grid-cols-3">
        <div><p className="font-serif text-3xl tracking-[.15em] text-white">VIRAGO</p><p className="mt-3 text-sm">Uñas que hablan por vos.<br />{ADDRESS}</p></div>
        <div className="flex flex-col gap-2 text-sm">{[["/servicios","Servicios"],["/galeria","Galería"],["/nosotros","Nosotros"],["/contacto","Contacto"]].map(([h,l])=><Link key={h} href={h} className="hover:text-white">{l}</Link>)}</div>
        <div className="flex flex-col gap-2 text-sm"><a href={waLink()}>WhatsApp</a><a href={INSTAGRAM}>Instagram</a><p>Lun a Sáb · 10 a 20 hs</p></div>
      </div>
      <p className="border-t border-white/10 py-5 text-center text-xs">© {new Date().getFullYear()} Virago Nails · Manicura en Rosario</p>
    </footer>
  );
}
