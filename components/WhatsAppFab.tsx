"use client";
import { motion } from "framer-motion";
import { waLink } from "@/lib/data";
export default function WhatsAppFab() {
  return (
    <motion.a href={waLink()} target="_blank" rel="noopener" aria-label="Reservar por WhatsApp"
      initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1, type: "spring" }} whileHover={{ scale: 1.08 }}
      className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full bg-[#25D366] px-5 py-3.5 text-sm font-medium text-white shadow-xl">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Z"/></svg>
      <span className="hidden sm:inline">Reservar</span>
    </motion.a>
  );
}
