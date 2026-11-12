export default function Placeholder({ tone, className = "", label }: { tone: string; className?: string; label?: string }) {
  return (
    <div className={`relative overflow-hidden bg-gradient-to-br ${tone} ${className}`} role="img" aria-label={label ?? "Imagen de uñas Virago Nails"}>
      <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/30 blur-2xl" />
      <span className="absolute bottom-3 left-4 text-[10px] uppercase tracking-[.3em] text-white/80">Virago</span>
    </div>
  );
}
