import { NextRequest, NextResponse } from "next/server";
import { createEvent, getBusy } from "@/lib/google";
import { MINUTES, computeSlots, serviceBySlug, toISO } from "@/lib/booking";
export async function POST(req: NextRequest) {
  const b = await req.json().catch(() => ({}));
  const { service, date, time, name, email, phone, website } = b;
  if (website) return NextResponse.json({ ok: true }); // honeypot anti-spam
  const svc = serviceBySlug(service);
  if (!svc || !/^\d{4}-\d{2}-\d{2}$/.test(date) || !/^\d{2}:\d{2}$/.test(time) || !name?.trim() || !/^\S+@\S+\.\S+$/.test(email) || !phone?.trim())
    return NextResponse.json({ error: "Completá todos los datos correctamente." }, { status: 400 });
  try {
    const dur = MINUTES[service], mins = +time.slice(0, 2) * 60 + +time.slice(3);
    const start = toISO(date, mins), end = toISO(date, mins + dur);
    const busy = await getBusy(toISO(date, 0), toISO(date, 24 * 60 - 1));
    if (!computeSlots(date, dur, busy).includes(time)) return NextResponse.json({ error: "Ese horario ya no está disponible. Elegí otro." }, { status: 409 });
    await createEvent({ summary: `${svc.name} · ${name.trim()}`, description: `Clienta: ${name}\nTel/WhatsApp: ${phone}\nEmail: ${email}\nServicio: ${svc.name} (${svc.dur})`, start, end, email, name: name.trim() });
    return NextResponse.json({ ok: true, start, end, title: `Virago Nails · ${svc.name}` });
  } catch { return NextResponse.json({ error: "No pudimos confirmar el turno. Escribinos por WhatsApp." }, { status: 502 }); }
}
