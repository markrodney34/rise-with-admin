"use client";
import Link from "next/link"; import { motion, useReducedMotion } from "framer-motion"; import { ArrowDownRight, MapPin } from "lucide-react"; import Photo from "./Photo";
export default function Hero({ badge, l1, l2, l3, sub }: { badge: string; l1: string; l2: string; l3: string; sub: string }) {
  const r = useReducedMotion(); const a = (d: number) => (r ? {} : { initial: { opacity: 0, y: 30 }, animate: { opacity: 1, y: 0 }, transition: { duration: .7, delay: d } });
  return (
    <section className="relative isolate flex min-h-[760px] items-end overflow-hidden bg-navy pb-24 pt-32 text-white sm:min-h-[88svh] sm:items-center sm:pb-20">
      <Photo slot="hero" priority sizes="100vw" /><div className="absolute inset-0 bg-gradient-to-t from-[#0a201b]/95 via-[#102b25]/55 to-[#102b25]/30 sm:bg-gradient-to-r sm:from-[#0a201b]/90 sm:via-[#102b25]/55 sm:to-[#102b25]/5" />
      <div className="absolute inset-0 opacity-[.12]" aria-hidden="true" style={{ backgroundImage: "linear-gradient(90deg,transparent 49.8%,rgba(255,255,255,.45) 50%,transparent 50.2%),radial-gradient(circle at center,transparent 0 12%,rgba(255,255,255,.45) 12.1% 12.25%,transparent 12.35%)", backgroundSize: "100% 100%" }} />
      <div className="wrap relative"><div className="max-w-4xl">
        <motion.p {...a(0.1)} className="inline-flex items-center gap-2 border border-white/30 bg-white/10 px-3 py-2 text-xs font-bold uppercase tracking-[.18em] backdrop-blur-sm"><MapPin size={14} className="text-lime" /> {badge}</motion.p>
        <motion.h1 {...a(0.25)} className="mt-6 max-w-4xl font-display text-[3.7rem] font-bold uppercase leading-[.88] tracking-[-.03em] sm:text-7xl lg:text-[6.5rem]">{l1}<br /><span className="text-lime">{l2}</span><br />{l3}</motion.h1>
        <motion.p {...a(0.4)} className="mt-6 max-w-xl text-base leading-7 text-white/85 sm:text-lg">{sub}</motion.p>
        <motion.div {...a(0.55)} className="mt-8 flex flex-col gap-3 sm:flex-row"><Link href="#leagues" className="btn-g">Explore our leagues <ArrowDownRight size={17} /></Link><Link href="/about" className="btn-o">Discover our story</Link></motion.div></div></div>
      <div className="absolute bottom-0 left-0 right-0 border-t border-white/20 bg-[#0a201b]/60 backdrop-blur-sm"><div className="wrap flex flex-wrap items-center justify-between gap-x-8 gap-y-2 py-4 text-xs font-bold uppercase tracking-[.14em] text-white/75"><span>Community first</span><span className="hidden h-1 w-1 rounded-full bg-lime sm:block" /><span>Talent for all</span><span className="hidden h-1 w-1 rounded-full bg-lime sm:block" /><span>Powered by sport</span><a href="#who" className="ml-auto inline-flex items-center gap-2 text-lime">Discover RISE <ArrowDownRight size={16} /></a></div></div>
    </section>);
}
