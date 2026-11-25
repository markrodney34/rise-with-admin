"use client";
import { useEffect, useState } from "react"; import { AnimatePresence, motion } from "framer-motion"; import { X } from "lucide-react"; import Photo from "./Photo"; import { useContent } from "./ContentProvider";
export default function HighlightsGrid() {
  const { highlights } = useContent(); const cats = ["All", ...Array.from(new Set(highlights.map((h) => h.cat)))];
  const [cat, setCat] = useState("All"); const [open, setOpen] = useState<number | null>(null);
  const list = highlights.filter((h) => cat === "All" || h.cat === cat); const cur = highlights.find((h) => h.id === open);
  useEffect(() => { const f = (e: KeyboardEvent) => e.key === "Escape" && setOpen(null); window.addEventListener("keydown", f); return () => window.removeEventListener("keydown", f); }, []);
  return (<>
    {cats.length > 2 && <div className="flex flex-wrap gap-2" role="group" aria-label="Filter highlights">{cats.map((c) => (
      <button key={c} onClick={() => setCat(c)} aria-pressed={cat === c} className={`min-h-[44px] px-5 font-semibold transition ${cat === c ? "bg-navy text-white" : "bg-mist text-navy hover:bg-blue hover:text-white"}`}>{c}</button>))}</div>}
    <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">{list.map((h) => (
      <button key={h.id} onClick={() => setOpen(h.id)} className="group relative aspect-[4/3] overflow-hidden text-left" aria-label={`Open ${h.title}`}>
        <div className="absolute inset-0 transition duration-700 group-hover:scale-105"><Photo slot={`h${h.id}`} tone={h.tone} sizes="(min-width:1024px) 33vw,100vw" /></div>
        <span className="absolute bottom-0 left-0 bg-navy px-3 py-2 font-semibold text-white">{h.title}</span></button>))}</div>
    <AnimatePresence>{cur && (<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} role="dialog" aria-modal="true" aria-label={cur.title} onClick={() => setOpen(null)}
      className="fixed inset-0 z-[60] grid place-items-center bg-ink/90 p-4"><button className="absolute right-4 top-4 grid h-12 w-12 place-items-center text-white" aria-label="Close" onClick={() => setOpen(null)}><X /></button>
      <div className="relative aspect-[4/3] w-full max-w-4xl overflow-hidden" onClick={(e) => e.stopPropagation()}><Photo slot={`h${cur.id}`} tone={cur.tone} /></div></motion.div>)}</AnimatePresence></>);
}
