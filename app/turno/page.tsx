"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

const today = () => new Date(Date.now() - 3 * 3600_000).toISOString().slice(0, 10);

const field = "w-full rounded-xl border border-ink/15 bg-white px-4 py-3 text-sm outline-none focus:border-ink";

type TurnoInfo = {
  name: string;
  email: string;
  phone: string;
  serviceName: string;
  start: string;
  end: string;
};

function TurnoContent() {
  const params = useSearchParams();
  const token = params.get("token") || "";
  const initialAction = params.get("action") === "cancel" ? "cancel" : "modify";

  const [mode, setMode] = useState<"modify" | "cancel">(initialAction);
  const [turno, setTurno] = useState<TurnoInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [date, setDate] = useState("");
  const [slots, setSlots] = useState<string[] | null>(null);
  const [time, setTime] = useState("");
  const [busy, setBusy] = useState(false);
  const [doneMessage, setDoneMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setErr("Falta el enlace de gestión del turno.");
      setLoading(false);
      return;
    }
    fetch(`/api/turno?token=${encodeURIComponent(token)}`)
      .then((r) => r.json())
      .then((j) => {
        if (j.error) setErr(j.error);
        else setTurno(j.turno);
      })
      .catch(() => setErr("No pudimos consultar los datos de tu turno."))
      .finally(() => setLoading(false));
  }, [token]);

  useEffect(() => {
    setTime("");
    setSlots(null);
    if (!token || !date || mode !== "modify") return;
    fetch(`/api/turno?token=${encodeURIComponent(token)}&date=${encodeURIComponent(date)}`)
      .then((r) => r.json())
      .then((j) => {
        if (!j.error) setSlots(j.slots || []);
      })
      .catch(() => setErr("Error al consultar disponibilidad."));
  }, [token, date, mode]);

  async function handleCancel() {
    setBusy(true);
    setErr("");
    const r = await fetch("/api/turno", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, action: "cancel" }),
    });
    const j = await r.json();
    setBusy(false);
    if (j.ok) {
      setDoneMessage("Tu turno fue anulado y el horario quedó libre en la agenda.");
    } else {
      setErr(j.error || "No pudimos anular el turno.");
    }
  }

  async function handleModify(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr("");
    const r = await fetch("/api/turno", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, action: "modify", date, time }),
    });
    const j = await r.json();
    setBusy(false);
    if (j.ok) {
      setDoneMessage(`Tu turno fue reprogramado para el ${date} a las ${time} hs.`);
    } else {
      setErr(j.error || "No pudimos reprogramar el turno.");
    }
  }

  return (
    <section className="mx-auto max-w-xl px-6 py-20">
      <p className="eyebrow">Virago Nails · Gestión de turno</p>
      <h1 className="mt-2 font-serif text-4xl">Administrar tu reserva</h1>

      <p className="mt-4 rounded-2xl border border-ink/10 bg-white p-4 text-xs leading-relaxed text-ink/70">
        Con mucho cariño te pedimos que, si necesitás cancelar o reprogramar tu turno, nos avises con al menos{" "}
        <strong className="text-ink">24 horas de anticipación</strong> para poder reorganizar la agenda.
      </p>

      {loading && <p className="mt-8 text-sm text-ink/60">Cargando información del turno…</p>}

      {!loading && err && !turno && (
        <div className="mt-8 rounded-3xl border border-ink/10 bg-white p-8">
          <p className="text-sm text-red-600">{err}</p>
        </div>
      )}

      {doneMessage && (
        <div className="mt-8 rounded-3xl bg-beige p-8 text-center">
          <p className="font-serif text-3xl">Listo</p>
          <p className="mt-3 text-sm leading-relaxed text-ink/75">{doneMessage}</p>
          <a href="/reservar" className="btn-dark mt-6 inline-block">
            Volver a reservas
          </a>
        </div>
      )}

      {!loading && turno && !doneMessage && (
        <div className="mt-8 space-y-6 rounded-3xl border border-ink/10 bg-white p-8">
          <div className="space-y-1 border-b border-ink/10 pb-5 text-sm">
            <p className="eyebrow">Turno actual</p>
            <p className="pt-2 font-serif text-2xl">{turno.serviceName}</p>
            <p className="text-ink/75">Clienta: {turno.name}</p>
            <p className="text-ink/75">
              Fecha y hora: {turno.start.slice(0, 10)} · {turno.start.slice(11, 16)} hs
            </p>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setMode("modify")}
              className={`flex-1 rounded-full border py-2.5 text-sm transition ${
                mode === "modify" ? "border-ink bg-ink text-white" : "border-ink/15 hover:border-ink"
              }`}
            >
              Modificar turno
            </button>
            <button
              type="button"
              onClick={() => setMode("cancel")}
              className={`flex-1 rounded-full border py-2.5 text-sm transition ${
                mode === "cancel" ? "border-ink bg-ink text-white" : "border-ink/15 hover:border-ink"
              }`}
            >
              Anular turno
            </button>
          </div>

          {mode === "modify" ? (
            <form onSubmit={handleModify} className="space-y-5">
              <div>
                <label className="eyebrow">Nuevo día</label>
                <input
                  required
                  type="date"
                  min={today()}
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className={`${field} mt-2`}
                />
              </div>

              {date && (
                <div>
                  <label className="eyebrow">Nuevo horario</label>
                  {slots === null && <p className="mt-2 text-sm text-ink/60">Consultando disponibilidad…</p>}
                  {slots?.length === 0 && (
                    <p className="mt-2 text-sm text-ink/60">No hay horarios disponibles ese día.</p>
                  )}
                  <div className="mt-2 grid grid-cols-4 gap-2">
                    {slots?.map((s) => (
                      <button
                        type="button"
                        key={s}
                        onClick={() => setTime(s)}
                        className={`rounded-full border py-2 text-sm transition ${
                          s === time ? "border-ink bg-ink text-white" : "border-ink/15 hover:border-ink"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={busy || !date || !time}
                className="btn-dark w-full disabled:opacity-50"
              >
                {busy ? "Guardando cambios…" : "Confirmar nuevo horario"}
              </button>
            </form>
          ) : (
            <div className="space-y-4">
              <p className="text-sm leading-relaxed text-ink/75">
                Si confirmás la anulación, se eliminará este turno de la agenda y el horario volverá a quedar libre.
              </p>
              <button
                type="button"
                disabled={busy}
                onClick={handleCancel}
                className="btn-dark w-full disabled:opacity-50"
              >
                {busy ? "Anulando turno…" : "Confirmar anulación"}
              </button>
            </div>
          )}

          {err && <p className="text-sm text-red-600">{err}</p>}
        </div>
      )}
    </section>
  );
}

export default function TurnoPage() {
  return (
    <Suspense fallback={<section className="mx-auto max-w-xl px-6 py-20 text-sm text-ink/60">Cargando…</section>}>
      <TurnoContent />
    </Suspense>
  );
}
