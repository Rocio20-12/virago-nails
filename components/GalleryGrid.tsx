"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Placeholder from "./Placeholder";
import { categories, gallery } from "@/lib/data";
export default function GalleryGrid({ limit }: { limit?: number }) {
  const [cat, setCat] = useState("Todos");
  const items = gallery.filter((g) => cat === "Todos" || g.cat === cat).slice(0, limit);
  return (
    <div>
      {!limit && (
        <div className="mb-8 flex gap-2 overflow-x-auto pb-2">
          {categories.map((c) => <button key={c} onClick={() => setCat(c)} className={`whitespace-nowrap rounded-full border px-5 py-2 text-sm transition ${c === cat ? "border-ink bg-ink text-white" : "border-ink/15 hover:border-ink"}`}>{c}</button>)}
        </div>
      )}
      <div className="columns-2 gap-3 md:columns-3 md:gap-5">
        <AnimatePresence>
          {items.map((g) => (
            <motion.div layout key={g.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} whileHover={{ y: -4 }} className="mb-3 break-inside-avoid overflow-hidden rounded-2xl md:mb-5">
              <Placeholder tone={g.tone} className={g.ratio} label={`Diseño de ${g.cat}`} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
