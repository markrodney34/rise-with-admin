"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Home, Info, Trophy, Images, Mail, ChevronUp } from "lucide-react";

const leagues = [
  { label: "Senior Soccer", href: "/senior-soccer" },
  { label: "Junior Soccer", href: "/junior-soccer" },
  { label: "Girls Soccer", href: "/girls-soccer" },
];

export default function MobileBottomNav() {
  const path = usePathname();
  const [leaguesOpen, setLeaguesOpen] = useState(false);
  const leagueActive = leagues.some((league) => path.startsWith(league.href));
  const items = [
    { label: "Home", href: "/", Icon: Home, active: path === "/" },
    { label: "About", href: "/about", Icon: Info, active: path.startsWith("/about") },
    { label: "Leagues", href: "#leagues", Icon: Trophy, active: leagueActive, action: true },
    { label: "Highlights", href: "/highlights", Icon: Images, active: path.startsWith("/highlights") },
    { label: "Contact", href: "/contact", Icon: Mail, active: path.startsWith("/contact") },
  ];

  return (
    <nav aria-label="Quick navigation" className="mobile-bottom-nav fixed inset-x-0 bottom-0 z-40 border-t border-navy/10 bg-white/95 backdrop-blur-md lg:hidden">
      {leaguesOpen && <>
        <button aria-label="Close leagues menu" className="fixed inset-0 z-0 bg-black/10" onClick={() => setLeaguesOpen(false)} />
        <div className="absolute inset-x-4 bottom-[calc(100%+0.75rem)] z-10 rounded-2xl border border-navy/10 bg-white p-2 shadow-lift">
          <p className="px-3 pb-1 pt-2 text-[10px] font-extrabold uppercase tracking-[.16em] text-ink/50">Explore our leagues</p>
          {leagues.map((league) => {
            const active = path.startsWith(league.href);
            return <Link key={league.href} href={league.href} aria-current={active ? "page" : undefined} onClick={() => setLeaguesOpen(false)} className={`block rounded-xl px-3 py-3 text-sm font-bold ${active ? "bg-mist text-grow" : "text-navy hover:bg-mist"}`}>
              {league.label}
            </Link>;
          })}
          <Link href="/girls-soccer#netball" onClick={() => setLeaguesOpen(false)} className="block rounded-xl px-3 py-3 text-sm font-bold text-navy hover:bg-mist">Community Netball</Link>
        </div>
      </>}
      <div className="relative z-20 grid min-h-[4.15rem] grid-cols-5 items-stretch">
        {items.map(({ label, href, Icon, active, action }) => action ? (
          <button key={label} type="button" aria-expanded={leaguesOpen} aria-label="Browse leagues" onClick={() => setLeaguesOpen((open) => !open)} className={`flex flex-col items-center justify-center gap-1 px-1 text-[10px] font-bold ${active || leaguesOpen ? "text-grow" : "text-ink/55"}`}>
            <span className={`relative grid h-7 w-11 place-items-center rounded-full transition ${active || leaguesOpen ? "bg-grow/10" : ""}`}><Icon size={19} strokeWidth={active || leaguesOpen ? 2.5 : 2} />{leaguesOpen && <ChevronUp className="absolute right-0 top-1/2 -translate-y-1/2" size={11} />}</span>
            {label}
          </button>
        ) : (
          <Link key={label} href={href} aria-current={active ? "page" : undefined} className={`flex flex-col items-center justify-center gap-1 px-1 text-[10px] font-bold ${active ? "text-grow" : "text-ink/55"}`}>
            <span className={`grid h-7 w-11 place-items-center rounded-full transition ${active ? "bg-grow/10" : ""}`}><Icon size={19} strokeWidth={active ? 2.5 : 2} /></span>
            {label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
