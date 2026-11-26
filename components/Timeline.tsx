import { getContent } from "@/lib/content"; import Reveal from "./Reveal";
export default async function Timeline() {
  const { milestones } = await getContent();
  return (
    <ol className="relative ml-3 border-l-2 border-blue/40 lg:ml-0 lg:grid lg:grid-cols-4 lg:gap-6 lg:border-l-0 lg:border-t-2 lg:pt-10">
      {milestones.map((m, i) => (
        <li key={m.year} className="relative pb-10 pl-8 last:pb-0 lg:pb-0 lg:pl-0">
          <span className="absolute -left-[9px] top-2 h-4 w-4 bg-grow lg:-top-[49px] lg:left-0" aria-hidden />
          <Reveal delay={i * 0.08}><div className="bg-white p-6 shadow-lift lg:min-h-[260px]"><p className="font-display text-5xl font-bold text-grow">{m.year}</p>
            <h3 className="mt-2 font-display text-2xl font-bold uppercase text-navy">{m.title}</h3><p className="mt-3 text-ink/80">{m.text}</p></div></Reveal>
        </li>))}
    </ol>);
}
