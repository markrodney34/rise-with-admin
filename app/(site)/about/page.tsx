import type { Metadata } from "next"; import PageHead from "@/components/PageHead"; import { Journey, CTA, Partners } from "@/components/Home"; import { getContent } from "@/lib/content";
export function generateMetadata(): Metadata { return { title: "About", description: getContent().about.sub, alternates: { canonical: "/about" } }; }
export default function About() { const a = getContent().about; return (<><PageHead title={a.title} sub={a.sub} />
  <section className="sec"><div className="wrap grid gap-10 lg:grid-cols-[2fr_1fr]"><div className="max-w-2xl space-y-5 text-lg">
    <h2 className="h-display text-4xl sm:text-5xl">{a.heading}</h2>{a.paragraphs.map((p, i) => <p key={i}>{p}</p>)}</div>
    <aside id="approach" className="h-fit bg-mist p-6"><h3 className="font-display text-2xl font-bold uppercase text-navy">{a.sideTitle}</h3><p className="mt-3">{a.sideText}</p></aside></div></section>
  <Journey /><Partners /><CTA /></>); }
