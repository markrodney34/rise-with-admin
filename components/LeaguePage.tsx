import { getContent } from "@/lib/content"; import PageHead from "./PageHead"; import Photo from "./Photo"; import Standings from "./Standings"; import { CTA, Gallery } from "./Home";
export default function LeaguePage({ k }: { k: string }) {
  const c = getContent(); const reasons = c.girlsReasons; const l = c.leagues[k]; const key = k.split("-")[0]; const seasons = c.standings[key] ?? [];
  const soccer = key === "girls" ? seasons.slice(0, 1) : seasons; const netball = key === "girls" ? seasons.slice(1) : [];
  return (<><PageHead title={l.name} sub={l.blurb} />
    <section className="sec"><div className="wrap grid gap-10 lg:grid-cols-2"><div className="relative aspect-[4/3] overflow-hidden border border-navy/10 shadow-lift"><Photo slot={l.img} sizes="(min-width:1024px) 50vw,100vw" /><span className="absolute bottom-4 left-4 bg-lime px-3 py-2 text-xs font-extrabold uppercase tracking-[.14em] text-navy">The RISE community</span></div>
      <div className="self-center"><p className="eyebrow">The competition</p><h2 className="h-display mt-3 text-4xl sm:text-5xl">About the league</h2><p className="mt-4 text-lg leading-8 text-ink/80">{l.intro}</p>
        {l.stats.length > 0 && <dl className="mt-6 grid grid-cols-2 gap-4">{l.stats.map(({ n, t }) => <div key={t} className="border-l-4 border-grow pl-3"><dt className="font-display text-4xl font-bold text-navy">{n}</dt><dd className="text-sm">{t}</dd></div>)}</dl>}</div></div></section>
    <section className="bg-mist sec"><div className="wrap grid gap-10 lg:grid-cols-[1fr_1.4fr]">
      <div><h2 className="h-display text-4xl">What the league is for</h2><ul className="mt-5 space-y-3">{l.objectives.map((o) => <li key={o} className="border-l-4 border-grow pl-4">{o}</li>)}</ul>
        {key === "girls" && reasons.length > 0 && <><h3 className="mt-8 font-display text-2xl font-bold uppercase text-navy">Why girls chose soccer</h3><ul className="mt-3 space-y-3">{reasons.map((o) => <li key={o} className="border-l-4 border-blue pl-4">{o}</li>)}</ul></>}</div>
      <div><h2 className="h-display text-4xl">League tables</h2><div className="mt-5">{soccer.length ? <Standings seasons={soccer} label={l.name} /> : <p>League tables coming soon.</p>}</div></div></div></section>
    {netball.length > 0 && <section id="netball" className="sec"><div className="wrap grid gap-10 lg:grid-cols-[1fr_1.4fr]">
      <div><h2 className="h-display text-4xl sm:text-5xl">Where it began: the netball league</h2>
        <p className="mt-4 text-lg">Having succeeded with the soccer league, demand grew for similar activities for girls and young women. RISE started with netball (the Mayuge Netball League, 2022 to 2023), which ran for four seasons with the same aims: community building, skills development, empowering girls and cultural dialogue on gender equality.</p></div>
      <div><Standings seasons={netball} label="Netball" /></div></div></section>}
    <Gallery n={3} /><CTA /></>);
}
