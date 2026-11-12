// Google Calendar de la dueña vía OAuth (refresh token). Sin dependencias extra.
const CAL = encodeURIComponent(process.env.GOOGLE_CALENDAR_ID || "primary");
async function token() {
  const r = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, cache: "no-store",
    body: new URLSearchParams({ client_id: process.env.GOOGLE_CLIENT_ID!, client_secret: process.env.GOOGLE_CLIENT_SECRET!, refresh_token: process.env.GOOGLE_REFRESH_TOKEN!, grant_type: "refresh_token" }),
  });
  const j = await r.json();
  if (!j.access_token) throw new Error("Google auth failed");
  return j.access_token as string;
}
export async function getBusy(timeMin: string, timeMax: string) {
  const r = await fetch("https://www.googleapis.com/calendar/v3/freeBusy", {
    method: "POST", cache: "no-store", headers: { Authorization: `Bearer ${await token()}`, "Content-Type": "application/json" },
    body: JSON.stringify({ timeMin, timeMax, items: [{ id: decodeURIComponent(CAL) }] }),
  });
  const j = await r.json();
  return (j.calendars?.[decodeURIComponent(CAL)]?.busy ?? []) as { start: string; end: string }[];
}
export async function createEvent(ev: { summary: string; description: string; start: string; end: string; email: string; name: string }) {
  const r = await fetch(`https://www.googleapis.com/calendar/v3/calendars/${CAL}/events?sendUpdates=all`, {
    method: "POST", headers: { Authorization: `Bearer ${await token()}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      summary: ev.summary, description: ev.description, location: process.env.NEXT_PUBLIC_SALON_ADDRESS || "Virago Nails, Rosario",
      start: { dateTime: ev.start, timeZone: "America/Argentina/Buenos_Aires" }, end: { dateTime: ev.end, timeZone: "America/Argentina/Buenos_Aires" },
      attendees: [{ email: ev.email, displayName: ev.name }],
      reminders: { useDefault: false, overrides: [{ method: "popup", minutes: 120 }, { method: "email", minutes: 1440 }] },
    }),
  });
  if (!r.ok) throw new Error("Calendar insert failed");
  return r.json();
}
