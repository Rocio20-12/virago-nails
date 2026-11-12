"use client";
import { useEffect, useState } from "react";
import { services } from "@/lib/data";
const today = () => new Date(Date.now() - 3 * 3600_000).toISOString().slice(0, 10);
const gcal = (d: { title: string; start: string; end: string }) => {
  const f = (s: string) => new Date(s).toISOString().replace(/[-:]|\.\d{3}/g, "");
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(d.title)}&dates=${f(d.start)}/${f(d.end)}&location=${encodeURIComponent("Virago Nails, Rosario")}`;
};
const field = "w-full rounded-xl border border-ink/15 bg-white px-4 py-3 text-sm outline-none focus:border-ink";
export default function BookingForm({ initial }: { initial?: string }) {
  const [service, setService] = useState(initial && services.some((s) => s.slug === initial) ? initial : "");
  const [date, setDate] = useState("");
  const [slots, setSlots] = useState<string[] | null>(null);
  const [time, setTime] = useState("");
  const [f, setF] = useState({ name: "", email: "", phone: "", website: "" });
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState<{ title: string; start: string; end: string } | null>(null);
  useEffect(() => {
    setTime(""); setSlots(null); setErr("");
    if (!service || !date) return;
    fetch(`/api/availability?service=${service}&date=${date}`).then((r) => r.json()).then((j) => j.error ? setErr(j.error) : setSlots(j.slots)).catch(() => setErr("Error de conexión"));
  }, [service, date]);
  async function submit(e: React.FormEvent) {
    e.preventDefault(); setBusy(true); setErr("");
    const r = await fetch("/api/book", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...f, service, date, time }) });
    const j = await r.json(); setBusy(false);
    if (j.ok) setDone(j); else setErr(j.error || "Error");
  }
  if (done) return (
    <div className="rounded-3xl bg-beige p-8 text-center">
      <p className="font-serif text-3xl">¡Turno confirmado!</p>
      <p className="mt-3 text-ink/70">Te enviamos una invitación a <b>{f.email}</b>. Aceptala y se guarda en tu Google Calendar.</p>
      <a href={gcal(done)} target="_blank" rel="noopener" className="btn-dark mt-6">Agregar a mi Google Calendar</a>
    </div>
  );
  return (
    <form onSubmit={submit} className="space-y-6">
      <div><label className="eyebrow">1 · Servicio</label>
        <select required value={service} onChange={(e) => setService(e.target.value)} className={`${field} mt-2`}>
          <option value="">Elegí un servicio</option>{services.map((s) => <option key={s.slug} value={s.slug}>{s.name} · {s.dur} · {s.price}</option>)}
        </select></div>
      <div><label className="eyebrow">2 · Día</label>
        <input required type="date" min={today()} value={date} onChange={(e) => setDate(e.target.value)} className={`${field} mt-2`} /></div>
      {service && date && (
        <div><label className="eyebrow">3 · Horario</label>
          {slots === null && !err && <p className="mt-2 text-sm text-ink/60">Consultando agenda…</p>}
          {slots?.length === 0 && <p className="mt-2 text-sm text-ink/60">No hay horarios ese día. Probá con otra fecha.</p>}
          <div className="mt-2 grid grid-cols-4 gap-2">{slots?.map((s) => <button type="button" key={s} onClick={() => setTime(s)} className={`rounded-full border py-2 text-sm transition ${s === time ? "border-ink bg-ink text-white" : "border-ink/15 hover:border-ink"}`}>{s}</button>)}</div></div>
      )}
      {time && (
        <div className="space-y-3"><label className="eyebrow">4 · Tus datos</label>
          <input required placeholder="Nombre y apellido" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} className={field} />
          <input required type="email" placeholder="Email de Google (para tu agenda)" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} className={field} />
          <input required type="tel" placeholder="WhatsApp" value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} className={field} />
          <input tabIndex={-1} autoComplete="off" aria-hidden className="hidden" value={f.website} onChange={(e) => setF({ ...f, website: e.target.value })} />
          <button disabled={busy} className="btn-dark w-full disabled:opacity-50">{busy ? "Confirmando…" : "Confirmar turno"}</button></div>
      )}
      {err && <p className="text-sm text-red-600">{err}</p>}
    </form>
  );
}
