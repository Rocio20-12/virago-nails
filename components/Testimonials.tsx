"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { testimonials } from "@/lib/data";
export default function Testimonials() {
  const [i, setI] = useState(0);
  useEffect(() => { const t = setInterval(() => setI((v) => (v + 1) % testimonials.length), 5000); return () => clearInterval(t); }, []);
  const t = testimonials[i];
  return (
    <div className="mx-auto max-w-2xl text-center">
      <p className="tracking-widest text-rose">★★★★★</p>
      <div className="relative mt-4 min-h-[180px]">
        <AnimatePresence mode="wait">
          <motion.div key={i} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.4 }}>
            <p className="font-serif text-2xl leading-snug md:text-3xl">“{t.text}”</p>
            <p className="mt-5 text-sm text-ink/60">{t.name}</p>
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="flex justify-center gap-2">
        {testimonials.map((_, k) => <button key={k} aria-label={`Opinión ${k + 1}`} onClick={() => setI(k)} className={`h-2 rounded-full transition-all ${k === i ? "w-6 bg-ink" : "w-2 bg-ink/20"}`} />)}
      </div>
    </div>
  );
}
