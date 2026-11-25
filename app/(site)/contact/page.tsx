import type { Metadata } from "next"; import { Mail, MapPin, Phone } from "lucide-react"; import PageHead from "@/components/PageHead"; import ContactForm from "@/components/ContactForm"; import { getContent } from "@/lib/content";
export const metadata: Metadata = { title: "Contact", description: "Get in touch with RISE Sports Foundation about partnerships, volunteering or joining a league.", alternates: { canonical: "/contact" } };
export default function Page() { const { site } = getContent(); return (<><PageHead title="Contact us" sub="Interested in joining this cause? Write to us about partnerships, volunteering or the leagues." />
  <section className="sec"><div className="wrap grid gap-12 lg:grid-cols-[1fr_1.2fr]"><div className="space-y-6"><h2 className="h-display text-4xl">Find us in Mayuge</h2>
    <p className="flex gap-3"><MapPin className="shrink-0 text-grow" />{site.address}</p><p className="flex gap-3"><Mail className="shrink-0 text-grow" /><a className="break-all underline" href={`mailto:${site.email}`}>{site.email}</a></p>
    {site.phone && <p className="flex gap-3"><Phone className="shrink-0 text-grow" />{site.phone}</p>}
    {site.social.length > 0 && <ul className="flex flex-wrap gap-4">{site.social.map((s) => <li key={s.href}><a className="underline" href={s.href}>{s.label}</a></li>)}</ul>}</div>
    <ContactForm /></div></section></>); }
