import { NextRequest, NextResponse } from "next/server";
import { getBusy } from "@/lib/google";
import { MINUTES, computeSlots, toISO } from "@/lib/booking";
export const dynamic = "force-dynamic";
export async function GET(req: NextRequest) {
  const date = req.nextUrl.searchParams.get("date") ?? "", s = req.nextUrl.searchParams.get("service") ?? "";
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !MINUTES[s]) return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
  try {
    const busy = await getBusy(toISO(date, 0), toISO(date, 24 * 60 - 1));
    return NextResponse.json({ slots: computeSlots(date, MINUTES[s], busy) });
  } catch { return NextResponse.json({ error: "No pudimos consultar la agenda" }, { status: 502 }); }
}
