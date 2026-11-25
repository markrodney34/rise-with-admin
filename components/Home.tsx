import Link from "next/link"; import { ArrowRight } from "lucide-react"; import { getContent } from "@/lib/content";
import Photo from "./Photo"; import Reveal from "./Reveal"; import Timeline from "./Timeline";
export function Who() {
  const { home: h } = getContent();
  return (<section id="who" className="sec"><div className="wrap grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
    <Reveal className="relative aspect-[4/5] overflow-hidden lg:aspect-[5/6]"><Photo slot="about" tone={2} sizes="(min-width:1024px) 50vw,100vw" /></Reveal>
    <Reveal><p className="eyebrow">Who we are</p><h2 className="h-display mt-3 text-5xl sm:text-6xl">{h.whoTitle}</h2>
      <p className="mt-5 text-lg">{h.whoText}</p>
      <dl className="mt-8 space-y-5 border-l-4 border-grow pl-5">
        <div><dt className="font-display text-2xl font-bold uppercase text-navy">Mission</dt><dd>{h.mission}</dd></div>
        {h.vision && <div><dt className="font-display text-2xl font-bold uppercase text-navy">Vision</dt><dd>{h.vision}</dd></div>}
        <div><dt className="font-display text-2xl font-bold uppercase text-navy">Core values</dt><dd>{h.values}</dd></div></dl>
      <Link href="/about" className="btn-n mt-8">Read our story <ArrowRight size={18} /></Link></Reveal></div></section>);
}
export function Leagues() {
  const e = Object.entries(getContent().leagues);
  return (<section id="leagues" className="bg-mist sec"><div className="wrap"><Reveal><p className="eyebrow">Find your game</p><div className="mt-3 flex flex-wrap items-end justify-between gap-4"><h2 className="h-display text-5xl sm:text-6xl">Our football leagues</h2><p className="max-w-sm text-sm leading-6 text-ink/65">A place to play, grow and belong—at every age and for every community.</p></div></Reveal>
    <div className="mt-10 grid gap-5 lg:h-[560px] lg:grid-cols-[1.4fr_1fr_1fr]">
      {e.map(([k, l], i) => (<Reveal key={k} delay={i * .1} className="h-full"><Link href={`/${k}`} className="group relative flex h-[420px] flex-col justify-end overflow-hidden border border-navy/10 bg-navy p-7 text-white shadow-lift lg:h-full">
        <div className="absolute inset-0 transition duration-700 group-hover:scale-105"><Photo slot={l.img} tone={i} sizes="(min-width:1024px) 40vw,100vw" /></div>
        <div className="absolute inset-0 bg-gradient-to-t from-navy/95 via-navy/40 to-transparent" />
        <div className="relative"><span className="mb-3 inline-flex border border-white/30 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[.18em] text-lime">{l.tag}</span><h3 className="font-display text-4xl font-bold uppercase">{l.name}</h3><p className="mt-2 max-w-sm text-sm leading-6 text-white/85">{l.blurb}</p>
          <span className="mt-5 inline-flex items-center gap-2 text-sm font-extrabold uppercase tracking-[.08em] text-lime transition-all group-hover:gap-4">Explore league <ArrowRight size={18} /></span></div></Link></Reveal>))}
    </div></div></section>);
}
export function Impact() {
  const { home: h } = getContent();
  return (<section id="impact" className="bg-navy text-white sec"><div className="wrap"><Reveal><p className="eyebrow text-lime">Growing together</p><h2 className="mt-3 font-display text-5xl font-bold uppercase leading-none sm:text-6xl">Our impact</h2>
    <p className="mt-4 max-w-2xl text-white/80">Milestones from our history. These are figures from each year, not current totals.</p></Reveal>
    <div className="mt-10 grid gap-px bg-white/20 sm:grid-cols-2 lg:grid-cols-4">
      {h.impact.map(({ n, t }, i) => (
        <div key={i} className="bg-navy p-6 lg:p-8"><p className="font-display text-6xl font-bold text-grow">{n}</p><p className="mt-2 text-white/85">{t}</p></div>))}
    </div></div></section>);
}
export function Journey({ id = "journey" }: { id?: string }) {
  return (<section id={id} className="sec"><div className="wrap"><Reveal><p className="eyebrow">From local idea to lasting impact</p><h2 className="h-display mt-3 max-w-3xl text-5xl sm:text-6xl">Our journey of growth and impact</h2></Reveal><div className="mt-12"><Timeline /></div></div></section>);
}
export function Gallery({ n = 6 }: { n?: number }) {
  const { highlights } = getContent();
  const spans = ["sm:col-span-2 sm:row-span-2", "", "", "sm:col-span-2", "", ""];
  return (<section className="bg-mist sec"><div className="wrap"><div className="flex flex-wrap items-end justify-between gap-4"><div><p className="eyebrow">Life at RISE</p><h2 className="h-display mt-3 text-5xl sm:text-6xl">Highlights</h2></div>
    <Link href="/highlights" className="btn-n">View all highlights</Link></div>
    <div className="mt-10 grid auto-rows-[200px] gap-3 sm:grid-cols-4">{highlights.slice(0, n).map((h, i) => (
      <div key={h.id} className={`group relative overflow-hidden ${spans[i]}`}><div className="absolute inset-0 transition duration-700 group-hover:scale-105"><Photo slot={`h${h.id}`} tone={h.tone} /></div>
        <p className="absolute bottom-0 left-0 bg-navy px-3 py-2 font-semibold text-white">{h.title}</p></div>))}</div></div></section>);
}
export function Partners() {
  const { partners, funders } = getContent();
  return (<section className="sec"><div className="wrap"><Reveal><p className="eyebrow">Stronger together</p><h2 className="h-display mt-3 text-5xl sm:text-6xl">A collaborative platform</h2>
    <p className="mt-4 max-w-2xl text-lg">RISE Sports Foundation was created in collaboration between these organisations.</p></Reveal>
    <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{partners.map((p) => (<li key={p.name} className="flex min-h-[140px] flex-col justify-between border border-navy/15 p-5"><p className="font-display text-2xl font-bold uppercase leading-tight text-navy">{p.name}</p><p className="text-sm text-ink/70">{p.where}</p></li>))}</ul>
    <p className="mt-10 font-semibold text-navy">Our funders</p><p className="mt-2 text-ink/80">{funders.join(", ")}</p>
</div></section>);
}
export function CTA() {
  const { home: h } = getContent();
  return (<section className="relative isolate overflow-hidden bg-navy py-24 text-white"><Photo slot="cta" tone={1} /><div className="absolute inset-0 bg-navy/75" />
    <div className="wrap relative"><h2 className="max-w-3xl font-display text-6xl font-bold uppercase leading-[.92] sm:text-8xl">{h.ctaTitle}</h2>
      <p className="mt-5 max-w-xl text-lg text-white/90">{h.ctaText}</p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row"><Link href="/contact#involved" className="btn-g">Get Involved</Link><Link href="/contact" className="btn-o">Contact Us</Link></div></div></section>);
}
