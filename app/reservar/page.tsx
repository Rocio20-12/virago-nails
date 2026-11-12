import type { Metadata } from "next";
import BookingForm from "@/components/BookingForm";
export const metadata: Metadata = { title: "Reservá tu turno online | Manicura en Rosario", description: "Elegí servicio, día y horario disponible. Tu turno se agenda en tu Google Calendar." };
export default async function Page({ searchParams }: { searchParams: Promise<{ s?: string }> }) {
  const { s } = await searchParams;
  return (
    <main className="mx-auto max-w-xl px-5 py-20">
      <p className="eyebrow">Reservas</p><h1 className="h2 mb-10 mt-2">Reservá tu turno</h1>
      <BookingForm initial={s} />
    </main>
  );
}
