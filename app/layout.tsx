import type { Metadata } from "next/types"; import { Barlow_Condensed, Manrope } from "next/font/google"; import "./globals.css";
import { getContent } from "@/lib/content"; import { ContentProvider } from "@/components/ContentProvider";
const display = Barlow_Condensed({ subsets: ["latin"], weight: ["600", "700"], variable: "--font-display" });
const body = Manrope({ subsets: ["latin"], variable: "--font-body" });
export function generateMetadata(): Metadata {
  const { site } = getContent();
  return { metadataBase: new URL(site.url), title: { default: `${site.name} | Grassroots sport in Mayuge, Uganda`, template: `%s | ${site.name}` },
    description: "RISE Sports Foundation empowers community development and youth talent through senior, junior and girls soccer leagues in Mayuge District, Uganda.",
    alternates: { canonical: "/" }, openGraph: { type: "website", siteName: site.name, title: site.name, description: site.tagline } };
}
export default function RootLayout({ children }: { children: React.ReactNode }) {
  const c = getContent(); const { site } = c;
  const ld = { "@context": "https://schema.org", "@type": "SportsOrganization", name: site.name, url: site.url, email: site.email, slogan: site.tagline, areaServed: "Mayuge District, Uganda" };
  return (<html lang="en" className={`${display.variable} ${body.variable}`}><body id="top">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
    <ContentProvider value={{ site: c.site, images: c.images, highlights: c.highlights, nav: c.nav }}>{children}</ContentProvider></body></html>);
}
