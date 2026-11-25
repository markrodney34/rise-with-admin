import Link from "next/link"; import { ArrowUp, Mail, MapPin, Phone } from "lucide-react"; import { getContent } from "@/lib/content"; import { Logo } from "./Navbar";
const cols = [
  { t: "Explore", l: [["Home", "/"], ["About Us", "/about"], ["Our Journey", "/about#journey"], ["Highlights", "/highlights"], ["Our Impact", "/#impact"]] },
  { t: "Our leagues", l: [["Senior Soccer", "/senior-soccer"], ["Junior Soccer", "/junior-soccer"], ["Girls Soccer", "/girls-soccer"], ["Community Sports", "/girls-soccer#netball"]] },
];
export default function Footer() {
  const { site } = getContent();
  const lk = "inline-block py-1.5 text-white/75 transition hover:translate-x-1 hover:text-white";
  return (
    <footer className="bg-navy text-white">
      <div className="border-b border-white/15"><div className="wrap flex flex-col gap-6 py-14 md:flex-row md:items-center md:justify-between">
        <div className="max-w-xl"><h2 className="font-display text-4xl font-bold uppercase leading-none sm:text-5xl">Sport has the power to change lives.</h2>
          <p className="mt-4 text-white/80">Join RISE Sports Foundation in building stronger communities and creating opportunities through grassroots sports.</p></div>
        <div className="flex flex-col gap-3 sm:flex-row"><Link href="/contact#involved" className="btn-g">Get Involved</Link><Link href="/contact" className="btn-o">Contact Us</Link></div></div></div>
      <div className="wrap grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div><Logo light /><p className="mt-4 max-w-xs text-white/75">Empowering community development and youth talent through sports in Mayuge District, Uganda.</p>
          <p className="mt-3 font-semibold">{site.tagline}</p>
          {site.social.length > 0 && <ul className="mt-4 flex gap-3">{site.social.map((s) => <li key={s.href}><a href={s.href} className="underline">{s.label}</a></li>)}</ul>}</div>
        {cols.map((c) => <nav key={c.t} aria-label={c.t}><h3 className="font-display text-xl font-bold uppercase text-grow">{c.t}</h3><ul className="mt-3">{c.l.map(([a, h]) => <li key={a}><Link href={h} className={lk}>{a}</Link></li>)}</ul></nav>)}
        <div><h3 className="font-display text-xl font-bold uppercase text-grow">Get in touch</h3>
          <ul className="mt-3 space-y-3 text-white/80">
            <li className="flex gap-2"><MapPin size={18} className="mt-1 shrink-0" />{site.address}</li>
            <li className="flex gap-2"><Mail size={18} className="mt-1 shrink-0" /><a className="break-all hover:text-white" href={`mailto:${site.email}`}>{site.email}</a></li>
            <li className="flex gap-2"><Phone size={18} className="mt-1 shrink-0" /><span>{site.phone || "—"}</span></li></ul></div>
      </div>
      <div className="border-t-4 border-grow bg-[#163a5c]"><div className="wrap flex flex-col items-start justify-between gap-3 py-5 text-sm text-white/75 sm:flex-row sm:items-center">
        <p>© {new Date().getFullYear()} RISE Sports Foundation</p>
        <div className="flex flex-wrap items-center gap-x-6"><Link href="/privacy" className="py-2 hover:text-white">Privacy Policy</Link><Link href="/terms" className="py-2 hover:text-white">Terms of Use</Link>
          <a href="#top" className="inline-flex items-center gap-1 py-2 font-semibold text-white"><ArrowUp size={16} />Back to top</a></div></div></div>
    </footer>
  );
}
