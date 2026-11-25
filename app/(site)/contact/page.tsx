import type { Metadata } from "next";
import { ExternalLink, Mail, MapPin, Phone } from "lucide-react";
import PageHead from "@/components/PageHead";
import ContactForm from "@/components/ContactForm";
import { getContent } from "@/lib/content";
export const metadata: Metadata = { title: "Contact", description: "Get in touch with RISE Sports Foundation about partnerships, volunteering or joining a league.", alternates: { canonical: "/contact" } };
export default function Page() {
  const { site } = getContent();
  const location = site.address || "Mayuge District, Uganda";
  const mapQuery = encodeURIComponent(location);
  const mapEmbed = `https://maps.google.com/maps?q=${mapQuery}&z=13&output=embed`;
  const mapLink = `https://www.google.com/maps/search/?api=1&query=${mapQuery}`;

  return (<><PageHead title="Contact us" sub="Interested in joining this cause? Write to us about partnerships, volunteering or the leagues." />
    <section className="relative overflow-hidden bg-mist py-14 sm:py-20">
      <div aria-hidden="true" className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full border border-grow/10 sm:h-96 sm:w-96" />
      <div aria-hidden="true" className="pointer-events-none absolute -right-8 -top-12 h-48 w-48 rounded-full border border-grow/10 sm:h-72 sm:w-72" />
      <div className="wrap relative grid gap-10 lg:grid-cols-[.85fr_1.15fr] lg:gap-14">
        <div className="flex flex-col justify-center">
          <p className="eyebrow">We’d love to hear from you</p>
          <h2 className="h-display mt-3 max-w-lg text-4xl sm:text-5xl">Let’s make something good happen.</h2>
          <p className="mt-5 max-w-lg text-base leading-7 text-ink/70">Whether you want to join a league, volunteer, or work with RISE, we’d be glad to hear from you.</p>
          <div className="mt-8 space-y-3">
            <div className="flex items-center gap-4 border border-navy/5 bg-white p-4 shadow-sm sm:p-5">
              <span className="grid h-11 w-11 shrink-0 place-items-center bg-grow/10 text-grow"><MapPin size={20} /></span>
              <div className="min-w-0"><p className="text-[10px] font-extrabold uppercase tracking-[.16em] text-ink/50">Our location</p><p className="mt-1 font-semibold text-navy">{location}</p></div>
            </div>
            <a href={`mailto:${site.email}`} className="group flex items-center gap-4 border border-navy/5 bg-white p-4 shadow-sm transition hover:border-grow/30 sm:p-5">
              <span className="grid h-11 w-11 shrink-0 place-items-center bg-grow/10 text-grow"><Mail size={20} /></span>
              <span className="min-w-0"><span className="block text-[10px] font-extrabold uppercase tracking-[.16em] text-ink/50">Email us</span><span className="mt-1 block break-all font-semibold text-navy group-hover:text-grow">{site.email}</span></span>
            </a>
            {site.phone && <a href={`tel:${site.phone.replace(/[^+\d]/g, "")}`} className="group flex items-center gap-4 border border-navy/5 bg-white p-4 shadow-sm transition hover:border-grow/30 sm:p-5">
              <span className="grid h-11 w-11 shrink-0 place-items-center bg-grow/10 text-grow"><Phone size={20} /></span>
              <span><span className="block text-[10px] font-extrabold uppercase tracking-[.16em] text-ink/50">Call us</span><span className="mt-1 block font-semibold text-navy group-hover:text-grow">{site.phone}</span></span>
            </a>}
          </div>
          {site.social.length > 0 && <div className="mt-6 flex flex-wrap items-center gap-3"><span className="text-xs font-bold uppercase tracking-wider text-ink/50">Follow along</span>{site.social.map((s) => <a key={s.href} className="border border-navy/10 bg-white px-3 py-2 text-sm font-semibold text-navy transition hover:border-grow hover:text-grow" href={s.href}>{s.label}</a>)}</div>}
        </div>
        <div className="border border-navy/10 bg-white p-5 shadow-lift sm:p-8 lg:p-9">
          <div className="mb-6 border-b border-navy/10 pb-5"><p className="eyebrow">Send a message</p><h3 className="h-display mt-2 text-3xl">What’s on your mind?</h3><p className="mt-2 text-sm leading-6 text-ink/65">Tell us a little about how you’d like to connect with RISE.</p></div>
          <ContactForm />
        </div>
      </div>
    </section>
    <section className="py-14 sm:py-20"><div className="wrap">
      <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div><p className="eyebrow">Our home</p><h2 className="h-display mt-2 text-3xl sm:text-4xl">Rooted in Mayuge.</h2><p className="mt-2 text-ink/70">Find our community in {location}.</p></div>
        <a href={mapLink} target="_blank" rel="noreferrer" className="btn-n w-full sm:w-auto"><MapPin size={17} />Open in Google Maps <ExternalLink size={15} /></a>
      </div>
      <div className="overflow-hidden border border-navy/10 bg-white p-2 shadow-lift sm:p-3">
        <iframe title={`Map showing ${location}`} src={mapEmbed} loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen className="h-[300px] w-full sm:h-[420px]" />
      </div>
    </div></section>
  </>);
}
