import type { Metadata } from "next"; import PageHead from "@/components/PageHead"; import { getContent } from "@/lib/content";
export const metadata: Metadata = { title: "Privacy Policy", description: "What this website does with your information.", alternates: { canonical: "/privacy" } };
export default function Page() { const { legal, site } = getContent(); return (<><PageHead title="Privacy policy" sub="What this website does with your information." /><section className="sec"><div className="wrap max-w-3xl space-y-5 text-lg">
  {legal.privacy.split(/\n{2,}/).map((p, i) => <p key={i}>{p}</p>)}<p className="text-base text-ink/70">Questions? <a className="underline" href={`mailto:${site.email}`}>{site.email}</a></p></div></section></>); }
