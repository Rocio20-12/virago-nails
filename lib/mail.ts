import crypto from "crypto";

const SECRET = process.env.TURNOS_SECRET || process.env.GOOGLE_CLIENT_SECRET || "virago-nails-secret";

export function signTurnoToken(payload: { eventId: string; serviceSlug: string; email: string; name: string; phone: string }) {
  const data = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const sig = crypto.createHmac("sha256", SECRET).update(data).digest("base64url");
  return `${data}.${sig}`;
}

export function verifyTurnoToken(token: string) {
  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const [data, sig] = parts;
  const expected = crypto.createHmac("sha256", SECRET).update(data).digest("base64url");
  if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null;
  try {
    return JSON.parse(Buffer.from(data, "base64url").toString("utf8")) as {
      eventId: string;
      serviceSlug: string;
      email: string;
      name: string;
      phone: string;
    };
  } catch {
    return null;
  }
}

async function googleAccessToken() {
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
  return j.access_token as string | undefined;
}

function buildRawEmail(to: string, from: string, subject: string, html: string) {
  const utf8Subject = `=?UTF-8?B?${Buffer.from(subject).toString("base64")}?=`;
  const message = [
    `From: Virago Nails <${from}>`,
    `To: ${to}`,
    `Subject: ${utf8Subject}`,
    "MIME-Version: 1.0",
    'Content-Type: text/html; charset="UTF-8"',
    "",
    html,
  ].join("\r\n");

  return Buffer.from(message).toString("base64url");
}

export async function sendTurnoEmail(params: {
  to: string;
  name: string;
  serviceName: string;
  dateLabel: string;
  timeLabel: string;
  address: string;
  modifyUrl: string;
  cancelUrl: string;
  kind?: "confirmed" | "updated" | "cancelled";
}) {
  const sender = process.env.GMAIL_SENDER || "viragonails.turnos@gmail.com";
  const accessToken = await googleAccessToken();
  if (!accessToken) return { sent: false, reason: "no_google_token" };

  const kind = params.kind || "confirmed";
  const titleMap = {
    confirmed: "Tu turno está confirmado",
    updated: "Tu turno fue reprogramado",
    cancelled: "Tu turno fue anulado",
  };
  const introMap = {
    confirmed: `Hola ${params.name}, reservamos tu espacio en Virago Nails. Acá tenés el resumen de tu turno:`,
    updated: `Hola ${params.name}, actualizamos el horario de tu turno en Virago Nails. Estos son los nuevos datos:`,
    cancelled: `Hola ${params.name}, te confirmamos que tu turno en Virago Nails fue anulado según tu solicitud.`,
  };

  const subject = `${titleMap[kind]} · Virago Nails`;

  const actionButtons =
    kind === "cancelled"
      ? ""
      : `
      <div style="margin-top:24px;text-align:center;">
        <a href="${params.modifyUrl}" style="display:inline-block;padding:12px 20px;margin:4px;background:#111111;color:#ffffff;text-decoration:none;border-radius:999px;font-size:13px;">Modificar turno</a>
        <a href="${params.cancelUrl}" style="display:inline-block;padding:12px 20px;margin:4px;border:1px solid #111111;color:#111111;text-decoration:none;border-radius:999px;font-size:13px;">Anular turno</a>
      </div>
    `;

  const policyBox =
    kind === "cancelled"
      ? ""
      : `
      <p style="margin-top:20px;padding:14px 16px;background:#f5f5f4;border-radius:12px;font-size:12px;line-height:1.6;color:#44403c;">
        Con mucho cariño te pedimos que, si necesitás cancelar o reprogramar tu visita, nos avises con al menos <strong>24 horas de anticipación</strong> para poder reorganizar la agenda y ofrecer ese lugar a otra clienta.
      </p>
    `;

  const html = `
    <div style="font-family:Georgia,serif;max-width:520px;margin:0 auto;padding:32px 24px;background:#ffffff;color:#111111;border:1px solid #e7e5e4;border-radius:20px;">
      <p style="font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#78716c;margin:0 0 8px;">Virago Nails</p>
      <h1 style="font-size:26px;font-weight:normal;margin:0 0 16px;">${titleMap[kind]}</h1>
      <p style="font-family:sans-serif;font-size:14px;line-height:1.6;color:#44403c;margin:0 0 20px;">${introMap[kind]}</p>
      <div style="font-family:sans-serif;font-size:14px;line-height:1.7;border-top:1px solid #e7e5e4;border-bottom:1px solid #e7e5e4;padding:16px 0;">
        <div><strong>Servicio:</strong> ${params.serviceName}</div>
        <div><strong>Día:</strong> ${params.dateLabel}</div>
        <div><strong>Horario:</strong> ${params.timeLabel}</div>
        <div><strong>Lugar:</strong> ${params.address}</div>
      </div>
      ${policyBox}
      ${actionButtons}
    </div>
  `;

  const raw = buildRawEmail(params.to, sender, subject, html);
  const res = await fetch("https://gmail.googleapis.com/gmail/v1/users/me/messages/send", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ raw }),
  });

  if (!res.ok) {
    return { sent: false, reason: "gmail_send_failed" };
  }

  return { sent: true };
}
