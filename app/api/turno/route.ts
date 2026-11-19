import { NextRequest, NextResponse } from "next/server";
import { deleteEvent, getBusy, getEvent, updateEventTime } from "@/lib/google";
import { MINUTES, computeSlots, serviceBySlug, toISO } from "@/lib/booking";
import { sendTurnoEmail, signTurnoToken, verifyTurnoToken } from "@/lib/mail";

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

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token") || "";
  const data = verifyTurnoToken(token);
  if (!data) return NextResponse.json({ error: "El enlace no es válido o venció." }, { status: 400 });

  const svc = serviceBySlug(data.serviceSlug);
  const ev = await getEvent(data.eventId);
  if (!ev) return NextResponse.json({ error: "Este turno ya fue anulado o no existe." }, { status: 404 });

  const dateParam = req.nextUrl.searchParams.get("date");
  let slots: string[] | null = null;
  if (dateParam && /^\d{4}-\d{2}-\d{2}$/.test(dateParam)) {
    const dur = MINUTES[data.serviceSlug] ?? 60;
    const busy = await getBusy(toISO(dateParam, 0), toISO(dateParam, 24 * 60 - 1));
    const evStart = new Date(ev.start.dateTime).getTime();
    const evEnd = new Date(ev.end.dateTime).getTime();
    const filteredBusy = busy.filter(
      (b) => !(Math.abs(new Date(b.start).getTime() - evStart) < 1000 && Math.abs(new Date(b.end).getTime() - evEnd) < 1000)
    );
    slots = computeSlots(dateParam, dur, filteredBusy);
  }

  return NextResponse.json({
    ok: true,
    turno: {
      name: data.name,
      email: data.email,
      phone: data.phone,
      serviceName: svc?.name || data.serviceSlug,
      start: ev.start.dateTime,
      end: ev.end.dateTime,
    },
    slots,
  });
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const { token, action, date, time } = body;

  const data = verifyTurnoToken(String(token || ""));
  if (!data) return NextResponse.json({ error: "El enlace no es válido o venció." }, { status: 400 });

  const svc = serviceBySlug(data.serviceSlug);
  const ev = await getEvent(data.eventId);
  if (!ev) return NextResponse.json({ error: "Este turno ya fue anulado o no existe." }, { status: 404 });

  const origin = process.env.NEXT_PUBLIC_SITE_URL || req.nextUrl.origin;
  const modifyUrl = `${origin}/turno?token=${encodeURIComponent(token)}&action=modify`;
  const cancelUrl = `${origin}/turno?token=${encodeURIComponent(token)}&action=cancel`;
  const serviceName = svc?.name || data.serviceSlug;
  const address = process.env.NEXT_PUBLIC_SALON_ADDRESS || "Virago Nails, Rosario";

  if (action === "cancel") {
    const currentDate = ev.start.dateTime.slice(0, 10);
    const currentTime = ev.start.dateTime.slice(11, 16);

    await deleteEvent(data.eventId);
    await sendTurnoEmail({
      to: data.email,
      name: data.name,
      serviceName,
      dateLabel: formatDateLabel(currentDate),
      timeLabel: `${currentTime} hs`,
      address,
      modifyUrl,
      cancelUrl,
      kind: "cancelled",
    }).catch(() => null);

    return NextResponse.json({ ok: true, status: "cancelled" });
  }

  if (action === "modify") {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(String(date || "")) || !/^\d{2}:\d{2}$/.test(String(time || ""))) {
      return NextResponse.json({ error: "Elegí un día y horario válidos." }, { status: 400 });
    }

    const dur = MINUTES[data.serviceSlug] ?? 60;
    const busy = await getBusy(toISO(date, 0), toISO(date, 24 * 60 - 1));
    const evStart = new Date(ev.start.dateTime).getTime();
    const evEnd = new Date(ev.end.dateTime).getTime();
    const filteredBusy = busy.filter(
      (b) => !(Math.abs(new Date(b.start).getTime() - evStart) < 1000 && Math.abs(new Date(b.end).getTime() - evEnd) < 1000)
    );

    if (!computeSlots(date, dur, filteredBusy).includes(time)) {
      return NextResponse.json({ error: "Ese horario ya no está disponible. Elegí otro." }, { status: 409 });
    }

    const mins = +time.slice(0, 2) * 60 + +time.slice(3);
    const nextStart = toISO(date, mins);
    const nextEnd = toISO(date, mins + dur);

    await updateEventTime(data.eventId, nextStart, nextEnd);

    const freshToken = signTurnoToken(data);
    await sendTurnoEmail({
      to: data.email,
      name: data.name,
      serviceName,
      dateLabel: formatDateLabel(date),
      timeLabel: `${time} hs`,
      address,
      modifyUrl: `${origin}/turno?token=${encodeURIComponent(freshToken)}&action=modify`,
      cancelUrl: `${origin}/turno?token=${encodeURIComponent(freshToken)}&action=cancel`,
      kind: "updated",
    }).catch(() => null);

    return NextResponse.json({ ok: true, status: "updated", start: nextStart, end: nextEnd });
  }

  return NextResponse.json({ error: "Acción no reconocida." }, { status: 400 });
}
