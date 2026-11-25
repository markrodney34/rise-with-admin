"use client";
import Link from "next/link"; import { usePathname } from "next/navigation"; import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion"; import { Menu, X, ChevronDown } from "lucide-react"; import manifest from "@/lib/assets.generated.json"; import { useContent } from "./ContentProvider";
export function Logo({ light = false }: { light?: boolean }) {
  const { images } = useContent(); const logo = images.logo?.src || manifest.logo;
  if (logo) return /* eslint-disable-next-line @next/next/no-img-element */ <img src={logo} alt="RISE Sports Foundation" className={`h-11 w-auto ${light ? "rounded-sm bg-white p-1" : ""}`} />;
  return <span className="flex items-center gap-2.5"><span className="grid h-10 w-10 place-items-center bg-grow font-display text-2xl font-bold text-white" aria-hidden>R</span>
    <span className={`font-display text-xl font-bold uppercase leading-none ${light ? "text-white" : "text-navy"}`}>RISE<span className="block text-[11px] tracking-[.18em] font-semibold opacity-80">Sports Foundation</span></span></span>;
}
export default function Navbar() {
  const { nav } = useContent(); const path = usePathname(); const [open, setOpen] = useState(false); const [solid, setSolid] = useState(false);
  useEffect(() => { const f = () => setSolid(window.scrollY > 24); f(); window.addEventListener("scroll", f, { passive: true }); return () => window.removeEventListener("scroll", f); }, []);
  useEffect(() => { setOpen(false); }, [path]);
  useEffect(() => { document.body.style.overflow = open ? "hidden" : ""; }, [open]);
  const active = (h: string) => (h === "/" ? path === "/" : path.startsWith(h));
  const bar = solid || open || path !== "/";
  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${bar ? "bg-white shadow-sm" : "bg-transparent"}`}>
      <div className="wrap flex h-[76px] items-center justify-between">
        <Link href="/" aria-label="RISE Sports Foundation home"><Logo light={!bar} /></Link>
        <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
          {nav.map((n) => n.children ? (
            <div key={n.label} className="group relative">
              <button className={`flex items-center gap-1 px-3 py-2 text-sm font-bold ${bar ? "text-navy" : "text-white"}`}>{n.label}<ChevronDown size={16} /></button>
              <div className="invisible absolute left-0 top-full w-56 border-t-2 border-grow bg-white py-2 opacity-0 shadow-lift transition group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
                {n.children.map((c) => <Link key={c.href} href={c.href} className="block px-4 py-3 text-sm font-semibold text-navy transition hover:bg-mist hover:pl-5">{c.label}</Link>)}
              </div></div>
          ) : (
            <Link key={n.href} href={n.href} aria-current={active(n.href) ? "page" : undefined} className={`relative px-3 py-2 text-sm font-bold ${bar ? "text-navy" : "text-white"}`}>
              {n.label}{active(n.href) && <span className="absolute inset-x-3 bottom-0 h-0.5 bg-grow" />}</Link>
          ))}
          <Link href="/contact#involved" className="btn-g ml-3 min-h-[42px]">Get Involved</Link>
        </nav>
        <button className={`grid h-12 w-12 place-items-center lg:hidden ${bar ? "text-navy" : "text-white"}`} onClick={() => setOpen(!open)} aria-expanded={open} aria-label={open ? "Close menu" : "Open menu"}>{open ? <X /> : <Menu />}</button>
      </div>
      <AnimatePresence>{open && (
        <motion.nav aria-label="Mobile" initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: .2 }}
          className="fixed inset-x-0 top-[76px] bottom-0 overflow-y-auto bg-white px-5 pb-10 lg:hidden">
          {[...nav.flatMap((n) => n.children ?? [n])].map((n) => <Link key={n.href} href={n.href} className={`block border-b border-mist py-4 font-display text-3xl font-bold uppercase ${active(n.href) ? "text-grow" : "text-navy"}`}>{n.label}</Link>)}
          <Link href="/contact#involved" className="btn-g mt-6 w-full">Get Involved</Link>
        </motion.nav>)}</AnimatePresence>
    </header>
  );
}
