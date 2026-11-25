import type { Metadata } from "next/types"; import PageHead from "@/components/PageHead"; import { getContent } from "@/lib/content";
export const metadata: Metadata = { title: "Terms of Use", description: "Using this website.", alternates: { canonical: "/terms" } };
export default function Page() { const { legal, site } = getContent(); return (<><PageHead title="Terms of use" sub="Using this website." /><section className="sec"><div className="wrap max-w-3xl space-y-5 text-lg">
  {legal.terms.split(/\n{2,}/).map((p, i) => <p key={i}>{p}</p>)}<p className="text-base text-ink/70">Questions? <a className="underline" href={`mailto:${site.email}`}>{site.email}</a></p></div></section></>); }
