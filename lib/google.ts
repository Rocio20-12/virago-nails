// Google Calendar del estudio vía OAuth (refresh token). Sin dependencias extra.
const CAL = encodeURIComponent(process.env.GOOGLE_CALENDAR_ID || "primary");

async function token() {
  const r = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    cache: "no-store",
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      refresh_token: process.env.GOOGLE_REFRESH_TOKEN!,
      grant_type: "refresh_token",
    }),
  });
  const j = await r.json();
  if (!j.access_token) throw new Error("Google auth failed");
  return j.access_token as string;
}

export async function getBusy(timeMin: string, timeMax: string) {
  const r = await fetch("https://www.googleapis.com/calendar/v3/freeBusy", {
    method: "POST",
    cache: "no-store",
    headers: { Authorization: `Bearer ${await token()}`, "Content-Type": "application/json" },
    body: JSON.stringify({ timeMin, timeMax, items: [{ id: decodeURIComponent(CAL) }] }),
  });
  const j = await r.json();
  return (j.calendars?.[decodeURIComponent(CAL)]?.busy ?? []) as { start: string; end: string }[];
}

export async function createEvent(ev: {
  summary: string;
  description: string;
  start: string;
  end: string;
  email: string;
  name: string;
}) {
  const r = await fetch(`https://www.googleapis.com/calendar/v3/calendars/${CAL}/events`, {
    method: "POST",
    headers: { Authorization: `Bearer ${await token()}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      summary: ev.summary,
      description: ev.description,
      location: process.env.NEXT_PUBLIC_SALON_ADDRESS || "Virago Nails, Rosario",
      start: { dateTime: ev.start, timeZone: "America/Argentina/Buenos_Aires" },
      end: { dateTime: ev.end, timeZone: "America/Argentina/Buenos_Aires" },
      reminders: { useDefault: false, overrides: [{ method: "popup", minutes: 120 }] },
    }),
  });
  if (!r.ok) throw new Error("Calendar insert failed");
  return r.json() as Promise<{ id: string; summary: string; description?: string; start: { dateTime: string }; end: { dateTime: string } }>;
}

export async function getEvent(eventId: string) {
  const r = await fetch(`https://www.googleapis.com/calendar/v3/calendars/${CAL}/events/${encodeURIComponent(eventId)}`, {
    cache: "no-store",
    headers: { Authorization: `Bearer ${await token()}` },
  });
  if (!r.ok) return null;
  const j = await r.json();
  if (j.status === "cancelled") return null;
  return j as {
    id: string;
    summary: string;
    description?: string;
    start: { dateTime: string };
    end: { dateTime: string };
  };
}

export async function updateEventTime(eventId: string, start: string, end: string) {
  const r = await fetch(`https://www.googleapis.com/calendar/v3/calendars/${CAL}/events/${encodeURIComponent(eventId)}`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${await token()}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      start: { dateTime: start, timeZone: "America/Argentina/Buenos_Aires" },
      end: { dateTime: end, timeZone: "America/Argentina/Buenos_Aires" },
    }),
  });
  if (!r.ok) throw new Error("Calendar update failed");
  return r.json();
}

export async function deleteEvent(eventId: string) {
  const r = await fetch(`https://www.googleapis.com/calendar/v3/calendars/${CAL}/events/${encodeURIComponent(eventId)}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${await token()}` },
  });
  if (!r.ok && r.status !== 410) throw new Error("Calendar delete failed");
}
