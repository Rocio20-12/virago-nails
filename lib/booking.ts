import { services } from "./data";

export const TZ_OFFSET = "-03:00"; // Rosario (sin horario de verano)
export const SLOT_STEP = 30; // minutos entre turnos posibles
export const MIN_NOTICE_HOURS = 3; // anticipación mínima

// Horario de atención por día (0=Dom): [apertura, cierre] en horas. null = cerrado. TODO: ajustar
export const HOURS: Record<number, [number, number] | null> = {
  0: null,
  1: [10, 20],
  2: [10, 20],
  3: [10, 20],
  4: [10, 20],
  5: [10, 20],
  6: [10, 16],
};

export const MINUTES: Record<string, number> = Object.fromEntries(
  services.map((s) => {
    const match = s.dur.match(/(\d+)/);
    return [s.slug, match ? Number(match[1]) : 60];
  })
);

export const serviceBySlug = (slug: string) => services.find((s) => s.slug === slug);

const pad = (n: number) => String(n).padStart(2, "0");

export const toISO = (date: string, mins: number) =>
  `${date}T${pad(Math.floor(mins / 60))}:${pad(mins % 60)}:00${TZ_OFFSET}`;

export function computeSlots(
  date: string,
  duration: number,
  busy: { start: string; end: string }[]
) {
  const dow = new Date(`${date}T12:00:00${TZ_OFFSET}`).getUTCDay();
  const h = HOURS[dow];
  if (!h) return [];
  const earliest = Date.now() + MIN_NOTICE_HOURS * 3600_000;
  const out: string[] = [];
  for (let m = h[0] * 60; m + duration <= h[1] * 60; m += SLOT_STEP) {
    const s = new Date(toISO(date, m)).getTime();
    const e = s + duration * 60_000;
    if (s < earliest) continue;
    if (busy.some((b) => s < new Date(b.end).getTime() && e > new Date(b.start).getTime())) {
      continue;
    }
    out.push(`${pad(Math.floor(m / 60))}:${pad(m % 60)}`);
  }
  return out;
}
