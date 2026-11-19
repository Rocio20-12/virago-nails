import { NextRequest, NextResponse } from "next/server";
import { createEvent, getBusy } from "@/lib/google";
import { MINUTES, computeSlots, serviceBySlug, toISO } from "@/lib/booking";
import { sendTurnoEmail, signTurnoToken } from "@/lib/mail";

function formatDateLabel(dateStr: string) {
  const [y, m, d] = dateStr.split("-").map(Number);
  if (!y || !m || !d) return dateStr;
  const dt = new Date(Date.UTC(y, m - 1, d, 12, 0, 0));
  return new Intl.DateTimeFormat("es-AR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: "America/Argentina/Buenos_Aires",
  }).format(dt);
}

export async function POST(req: NextRequest) {
  const b = await req.json().catch(() => ({}));
  const { service, date, time, name, email, phone, website } = b;

  if (website) return NextResponse.json({ ok: true }); // honeypot anti-spam

  const svc = serviceBySlug(service);
  if (
    !svc ||
    !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
    !/^\d{2}:\d{2}$/.test(time) ||
    !name?.trim() ||
    !/^\S+@\S+\.\S+$/.test(email) ||
    !phone?.trim()
  ) {
    return NextResponse.json({ error: "Completá todos los datos correctamente." }, { status: 400 });
  }

  try {
    const dur = MINUTES[service] ?? 60;
    const mins = +time.slice(0, 2) * 60 + +time.slice(3);
    const start = toISO(date, mins);
    const end = toISO(date, mins + dur);

    const busy = await getBusy(toISO(date, 0), toISO(date, 24 * 60 - 1));
    if (!computeSlots(date, dur, busy).includes(time)) {
      return NextResponse.json({ error: "Ese horario ya no está disponible. Elegí otro." }, { status: 409 });
    }

    const cleanName = name.trim();
    const cleanEmail = email.trim();
    const cleanPhone = phone.trim();

    const created = await createEvent({
      summary: `${svc.name} · ${cleanName}`,
      description: `Clienta: ${cleanName}\nTel/WhatsApp: ${cleanPhone}\nEmail: ${cleanEmail}\nServicio: ${svc.name} (${svc.dur})`,
      start,
      end,
      email: cleanEmail,
      name: cleanName,
    });

    const origin = process.env.NEXT_PUBLIC_SITE_URL || req.nextUrl.origin;
    const token = signTurnoToken({
      eventId: created.id,
      serviceSlug: service,
      email: cleanEmail,
      name: cleanName,
      phone: cleanPhone,
    });

    const modifyUrl = `${origin}/turno?token=${encodeURIComponent(token)}&action=modify`;
    const cancelUrl = `${origin}/turno?token=${encodeURIComponent(token)}&action=cancel`;

    await sendTurnoEmail({
      to: cleanEmail,
      name: cleanName,
      serviceName: svc.name,
      dateLabel: formatDateLabel(date),
      timeLabel: `${time} hs`,
      address: process.env.NEXT_PUBLIC_SALON_ADDRESS || "Virago Nails, Rosario",
      modifyUrl,
      cancelUrl,
      kind: "confirmed",
    }).catch(() => null);

    return NextResponse.json({ ok: true, start, end, title: `Virago Nails · ${svc.name}` });
  } catch {
    return NextResponse.json(
      { error: "No pudimos confirmar el turno. Escribinos por WhatsApp." },
      { status: 502 }
    );
  }
}
