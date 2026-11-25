"use client";
import { useState } from "react";
import { Check, Image as ImgIcon, Inbox, LayoutDashboard, Link2, ListOrdered, LogOut, Mail, Newspaper, Plus, Settings, Shield, Trophy, Trash2, Upload, Users, X, Home as HomeIcon, Info, Flag, Camera, Table2 } from "lucide-react";
import type { Content, Message, Row, Season } from "@/lib/types";
import { Field, Area, Card, ListEditor, Reorder, SaveBar, ImageField, Picker } from "./ui";

type Upload = { name: string; url: string; time: number };
const TABS = [
  ["dashboard", "Dashboard", LayoutDashboard], ["site", "Site & contact", Settings], ["home", "Home page", HomeIcon], ["about", "About page", Info], ["leagues", "Leagues", Flag],
  ["journey", "Our journey", ListOrdered], ["partners", "Partners & funders", Users], ["highlights", "Highlights gallery", Camera], ["photos", "Page photos & logo", ImgIcon],
  ["standings", "League tables", Table2], ["nav", "Navigation", Link2], ["legal", "Privacy & terms", Shield], ["messages", "Messages", Inbox], ["account", "Account", Newspaper],
] as const;
type Tab = (typeof TABS)[number][0];

export default function AdminApp({ initial, uploads: up0, messages: m0, defaultPw }: { initial: Content; uploads: Upload[]; messages: Message[]; defaultPw: boolean }) {
  const [c, setC] = useState<Content>(initial); const [uploads, setUploads] = useState(up0); const [msgs, setMsgs] = useState(m0); const [tab, setTab] = useState<Tab>("dashboard");
  const [status, setStatus] = useState<Record<string, string>>({}); const [menu, setMenu] = useState(false); const [picker, setPicker] = useState<null | ((url: string) => void)>(null);
  const unread = msgs.filter((m) => !m.read).length;
  const set = <K extends keyof Content>(k: K, v: Content[K]) => setC((p) => ({ ...p, [k]: v }));

  async function save(section: keyof Content) {
    setStatus((s) => ({ ...s, [section]: "saving" }));
    const r = await fetch("/api/admin/content", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ section, value: c[section] }) });
    setStatus((s) => ({ ...s, [section]: r.ok ? "saved" : "error" })); setTimeout(() => setStatus((s) => ({ ...s, [section]: "" })), 2500);
  }
  const bar = (section: keyof Content, extra?: string) => <SaveBar state={status[section]} onSave={() => save(section)} note={extra} />;
  async function upload(files: FileList | null): Promise<string[]> {
    if (!files?.length) return []; const fd = new FormData(); Array.from(files).forEach((f) => fd.append("files", f));
    const r = await fetch("/api/admin/upload", { method: "POST", body: fd }); const j = await r.json(); if (!r.ok) { alert(j.error); return []; } setUploads(j.uploads); return j.urls;
  }
  const pick = (cb: (u: string) => void) => setPicker(() => cb);
  async function logout() { await fetch("/api/admin/logout", { method: "POST" }); location.reload(); }

  return (<div className="flex min-h-screen">
    <aside className={`fixed inset-y-0 left-0 z-40 w-64 shrink-0 overflow-y-auto bg-navy text-white transition-transform lg:static lg:translate-x-0 ${menu ? "translate-x-0" : "-translate-x-full"}`}>
      <div className="flex items-center gap-2.5 border-b border-white/15 p-5"><span className="grid h-10 w-10 place-items-center bg-grow font-display text-2xl font-bold">R</span><div><p className="font-display text-xl font-bold uppercase leading-none">RISE Admin</p><p className="text-xs text-white/60">Website control panel</p></div></div>
      <nav className="p-3">{TABS.map(([k, label, Icon]) => (<button key={k} onClick={() => { setTab(k); setMenu(false); }} className={`flex w-full items-center gap-3 px-3 py-2.5 text-left text-sm font-semibold transition ${tab === k ? "bg-grow text-white" : "text-white/80 hover:bg-white/10"}`}>
        <Icon size={17} />{label}{k === "messages" && unread > 0 && <span className="ml-auto bg-lime px-2 text-xs font-bold text-navy">{unread}</span>}</button>))}</nav>
      <div className="space-y-1 border-t border-white/15 p-3 text-sm"><a href="/" target="_blank" className="block px-3 py-2 text-white/80 hover:bg-white/10">View website ↗</a><button onClick={logout} className="flex w-full items-center gap-2 px-3 py-2 text-white/80 hover:bg-white/10"><LogOut size={16} />Sign out</button></div>
    </aside>
    {menu && <div className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={() => setMenu(false)} />}
    <div className="min-w-0 flex-1">
      <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-navy/10 bg-white px-4 py-3 lg:px-8"><button className="grid h-10 w-10 place-items-center border border-navy/20 lg:hidden" onClick={() => setMenu(true)} aria-label="Menu">☰</button>
        <h1 className="font-display text-2xl font-bold uppercase text-navy">{TABS.find((t) => t[0] === tab)![1]}</h1><a href="/" target="_blank" className="btn-n ml-auto !min-h-[38px] !px-4 !py-1 text-sm">View site ↗</a></header>
      <div className="mx-auto max-w-5xl space-y-6 p-4 lg:p-8">

        {tab === "dashboard" && <>
          {defaultPw && <p className="border-l-4 border-amber-500 bg-amber-50 p-4 text-sm text-amber-900"><b>Security:</b> you are using the default password. Go to <button className="underline" onClick={() => setTab("account")}>Account</button> and change it now.</p>}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{[["Unread messages", unread, "messages"], ["Gallery photos", c.highlights.length, "highlights"], ["Seasons of tables", Object.values(c.standings).flat().length, "standings"], ["Uploaded files", uploads.length, "photos"]].map(([l, n, t]) => (
            <button key={l as string} onClick={() => setTab(t as Tab)} className="border border-navy/10 bg-white p-5 text-left shadow-lift transition hover:border-grow"><p className="font-display text-5xl font-bold text-grow">{n as number}</p><p className="mt-1 text-sm font-semibold text-navy">{l as string}</p></button>))}</div>
          <Card title="What you can control"><ul className="grid gap-2 text-sm sm:grid-cols-2">{TABS.slice(1, 12).map(([k, l]) => <li key={k}><button className="underline" onClick={() => setTab(k)}>{l}</button></li>)}</ul>
            <p className="mt-4 text-sm text-ink/70">Every change is published to the live website the moment you press <b>Save</b> in a section.</p></Card>
        </>}

        {tab === "site" && <Card title="Organisation details">
          <div className="grid gap-4 sm:grid-cols-2"><Field label="Site name" value={c.site.name} onChange={(v) => set("site", { ...c.site, name: v })} /><Field label="Website URL" value={c.site.url} onChange={(v) => set("site", { ...c.site, url: v })} />
            <Field label="Contact email" value={c.site.email} onChange={(v) => set("site", { ...c.site, email: v })} /><Field label="Phone" value={c.site.phone} onChange={(v) => set("site", { ...c.site, phone: v })} />
            <Field label="Address" value={c.site.address} onChange={(v) => set("site", { ...c.site, address: v })} /><Field label="Tagline" value={c.site.tagline} onChange={(v) => set("site", { ...c.site, tagline: v })} /></div>
          <h3 className="mt-6 font-semibold text-navy">Social links</h3>
          <ListEditor items={c.site.social} onChange={(s) => set("site", { ...c.site, social: s })} blank={{ label: "", href: "" }} addLabel="Add social link" render={(s, u) => <div className="grid flex-1 gap-2 sm:grid-cols-2"><Field label="Name (e.g. Facebook)" value={s.label} onChange={(v) => u({ ...s, label: v })} /><Field label="URL" value={s.href} onChange={(v) => u({ ...s, href: v })} /></div>} />
          {bar("site")}</Card>}

        {tab === "home" && <Card title="Home page text">
          <div className="grid gap-4"><Field label="Hero badge" value={c.home.heroBadge} onChange={(v) => set("home", { ...c.home, heroBadge: v })} />
            <div className="grid gap-4 sm:grid-cols-3"><Field label="Headline line 1" value={c.home.heroLine1} onChange={(v) => set("home", { ...c.home, heroLine1: v })} /><Field label="Line 2 (highlighted)" value={c.home.heroLine2} onChange={(v) => set("home", { ...c.home, heroLine2: v })} /><Field label="Line 3" value={c.home.heroLine3} onChange={(v) => set("home", { ...c.home, heroLine3: v })} /></div>
            <Area label="Hero sub-text" value={c.home.heroSub} onChange={(v) => set("home", { ...c.home, heroSub: v })} />
            <Field label="“Who we are” heading" value={c.home.whoTitle} onChange={(v) => set("home", { ...c.home, whoTitle: v })} /><Area label="“Who we are” text" value={c.home.whoText} onChange={(v) => set("home", { ...c.home, whoText: v })} />
            <Field label="Mission" value={c.home.mission} onChange={(v) => set("home", { ...c.home, mission: v })} /><Field label="Vision (leave blank to hide)" value={c.home.vision} onChange={(v) => set("home", { ...c.home, vision: v })} /><Field label="Core values" value={c.home.values} onChange={(v) => set("home", { ...c.home, values: v })} />
            <Field label="Call-to-action heading" value={c.home.ctaTitle} onChange={(v) => set("home", { ...c.home, ctaTitle: v })} /><Area label="Call-to-action text" value={c.home.ctaText} onChange={(v) => set("home", { ...c.home, ctaText: v })} /></div>
          <h3 className="mt-6 font-semibold text-navy">“Our impact” figures</h3>
          <ListEditor items={c.home.impact} onChange={(i) => set("home", { ...c.home, impact: i })} blank={{ n: "", t: "" }} addLabel="Add figure" render={(s, u) => <div className="grid flex-1 gap-2 sm:grid-cols-[120px_1fr]"><Field label="Number" value={s.n} onChange={(v) => u({ ...s, n: v })} /><Field label="Description" value={s.t} onChange={(v) => u({ ...s, t: v })} /></div>} />
          {bar("home")}</Card>}

        {tab === "about" && <Card title="About page">
          <div className="grid gap-4"><Field label="Page title" value={c.about.title} onChange={(v) => set("about", { ...c.about, title: v })} /><Field label="Sub-title" value={c.about.sub} onChange={(v) => set("about", { ...c.about, sub: v })} /><Field label="Section heading" value={c.about.heading} onChange={(v) => set("about", { ...c.about, heading: v })} /></div>
          <h3 className="mt-6 font-semibold text-navy">Paragraphs</h3>
          <ListEditor items={c.about.paragraphs} onChange={(p) => set("about", { ...c.about, paragraphs: p })} blank="" addLabel="Add paragraph" render={(s, u) => <Area label="Paragraph" value={s} onChange={u} rows={4} />} />
          <div className="mt-6 grid gap-4"><Field label="Side box title" value={c.about.sideTitle} onChange={(v) => set("about", { ...c.about, sideTitle: v })} /><Area label="Side box text" value={c.about.sideText} onChange={(v) => set("about", { ...c.about, sideText: v })} /></div>
          {bar("about")}</Card>}

        {tab === "leagues" && <>{Object.entries(c.leagues).map(([k, l]) => { const up = (p: Partial<typeof l>) => set("leagues", { ...c.leagues, [k]: { ...l, ...p } }); return (
          <Card key={k} title={l.name} sub={`/${k}`}><div className="grid gap-4 sm:grid-cols-2"><Field label="League name" value={l.name} onChange={(v) => up({ name: v })} /><Field label="Home-page tag" value={l.tag} onChange={(v) => up({ tag: v })} /></div>
            <div className="mt-4 grid gap-4"><Area label="Short blurb" value={l.blurb} onChange={(v) => up({ blurb: v })} rows={2} /><Area label="Introduction" value={l.intro} onChange={(v) => up({ intro: v })} rows={4} /></div>
            <h3 className="mt-5 font-semibold text-navy">Objectives</h3><ListEditor items={l.objectives} onChange={(o) => up({ objectives: o })} blank="" addLabel="Add objective" render={(s, u) => <Area label="Objective" value={s} onChange={u} rows={2} />} />
            <h3 className="mt-5 font-semibold text-navy">Key figures</h3><ListEditor items={l.stats} onChange={(s) => up({ stats: s })} blank={{ n: "", t: "" }} addLabel="Add figure" render={(s, u) => <div className="grid flex-1 gap-2 sm:grid-cols-[120px_1fr]"><Field label="Number" value={s.n} onChange={(v) => u({ ...s, n: v })} /><Field label="Description" value={s.t} onChange={(v) => u({ ...s, t: v })} /></div>} />
          </Card>); })}
          <Card title="Girls soccer: “Why girls chose soccer”"><ListEditor items={c.girlsReasons} onChange={(r) => set("girlsReasons", r)} blank="" addLabel="Add reason" render={(s, u) => <Area label="Reason" value={s} onChange={u} rows={2} />} />{bar("girlsReasons")}</Card>
          <Card title="Save leagues">{bar("leagues", "Saves all three league pages.")}</Card></>}

        {tab === "journey" && <Card title="Timeline milestones"><ListEditor reorder items={c.milestones} onChange={(m) => set("milestones", m)} blank={{ year: "", title: "", text: "" }} addLabel="Add milestone" render={(s, u) => <div className="grid flex-1 gap-2"><div className="grid gap-2 sm:grid-cols-[140px_1fr]"><Field label="Year" value={s.year} onChange={(v) => u({ ...s, year: v })} /><Field label="Title" value={s.title} onChange={(v) => u({ ...s, title: v })} /></div><Area label="Text" value={s.text} onChange={(v) => u({ ...s, text: v })} rows={2} /></div>} />{bar("milestones")}</Card>}

        {tab === "partners" && <><Card title="Partners"><ListEditor reorder items={c.partners} onChange={(p) => set("partners", p)} blank={{ name: "", where: "", role: "" }} addLabel="Add partner" render={(s, u) => <div className="grid flex-1 gap-2 sm:grid-cols-3"><Field label="Name" value={s.name} onChange={(v) => u({ ...s, name: v })} /><Field label="Location" value={s.where} onChange={(v) => u({ ...s, where: v })} /><Field label="Role" value={s.role} onChange={(v) => u({ ...s, role: v })} /></div>} />{bar("partners")}</Card>
          <Card title="Funders"><ListEditor items={c.funders} onChange={(f) => set("funders", f)} blank="" addLabel="Add funder" render={(s, u) => <Field label="Funder" value={s} onChange={u} />} />{bar("funders")}</Card></>}

        {tab === "highlights" && <Card title="Highlights gallery" sub="Shown on the Home page (first 6), league pages (first 3) and the Highlights page.">
          <div className="flex flex-wrap gap-3"><label className="btn-g cursor-pointer !min-h-[42px]"><Upload size={16} />Upload photos<input type="file" accept="image/*" multiple hidden onChange={async (e) => { const urls = await upload(e.target.files); if (urls.length) { let id = Math.max(0, ...c.highlights.map((h) => h.id)); set("highlights", [...c.highlights, ...urls.map((src, i) => ({ id: ++id, cat: "Highlights", title: `Photo ${c.highlights.length + i + 1}`, tone: (c.highlights.length + i) % 4, src }))]); } e.target.value = ""; }} /></label>
            <button className="btn-n !min-h-[42px]" onClick={() => set("highlights", [{ id: Math.max(0, ...c.highlights.map((h) => h.id)) + 1, cat: "Highlights", title: "New photo", tone: 0, src: "" }, ...c.highlights])}><Plus size={16} />Add by URL / library</button></div>
          <p className="mt-2 text-sm text-ink/70">Photos are listed in display order. Use the arrows to reorder; categories create filter buttons on the Highlights page.</p>
          <ul className="mt-4 space-y-3">{c.highlights.map((h, i) => (<li key={h.id} className="flex gap-3 border border-navy/15 bg-white p-3">
            <div className="h-24 w-32 shrink-0 bg-mist bg-cover bg-center" style={h.src ? { backgroundImage: `url(${h.src})` } : undefined}>{!h.src && <span className="grid h-full place-items-center text-xs text-ink/50">No image</span>}</div>
            <div className="grid min-w-0 flex-1 gap-2 sm:grid-cols-2"><Field label="Caption" value={h.title} onChange={(v) => set("highlights", c.highlights.map((x, j) => (j === i ? { ...h, title: v } : x)))} /><Field label="Category" value={h.cat} onChange={(v) => set("highlights", c.highlights.map((x, j) => (j === i ? { ...h, cat: v } : x)))} />
              <button className="text-left text-sm underline" onClick={() => pick((u) => set("highlights", c.highlights.map((x, j) => (j === i ? { ...h, src: u } : x))))}>Change image</button></div>
            <Reorder i={i} n={c.highlights.length} onMove={(a, b) => { const l = [...c.highlights]; [l[a], l[b]] = [l[b], l[a]]; set("highlights", l); }} onDelete={() => confirm("Remove this photo from the gallery?") && set("highlights", c.highlights.filter((_, j) => j !== i))} /></li>))}</ul>
          {bar("highlights")}</Card>}

        {tab === "photos" && <Card title="Page photos & logo" sub="Pick the main picture for each spot on the site. Clear to show the default artwork.">
          <div className="grid gap-5 sm:grid-cols-2">{[["hero", "Home hero (big banner)"], ["about", "Home “Who we are”"], ["cta", "“Be part of the change” banner"], ["senior", "Senior Soccer"], ["junior", "Junior Soccer"], ["girls", "Girls Soccer"], ["logo", "Logo (leave empty for text logo)"]].map(([k, l]) => (
            <ImageField key={k} label={l} value={c.images[k]?.src ?? ""} alt={c.images[k]?.alt ?? ""} onPick={() => pick((u) => set("images", { ...c.images, [k]: { alt: c.images[k]?.alt ?? "", src: u } }))} onClear={() => set("images", { ...c.images, [k]: { alt: c.images[k]?.alt ?? "", src: "" } })} onAlt={(a) => set("images", { ...c.images, [k]: { src: c.images[k]?.src ?? "", alt: a } })} />))}</div>
          {bar("images")}
          <h3 className="mt-8 font-semibold text-navy">Media library ({uploads.length})</h3>
          <div className="mt-3 flex gap-3"><label className="btn-n cursor-pointer !min-h-[42px]"><Upload size={16} />Upload images<input type="file" accept="image/*" multiple hidden onChange={async (e) => { await upload(e.target.files); e.target.value = ""; }} /></label></div>
          <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">{uploads.map((u) => (<li key={u.name} className="group relative aspect-square bg-mist bg-cover bg-center" style={{ backgroundImage: `url(${u.url})` }}>
            <button className="absolute right-1 top-1 hidden bg-white p-1.5 text-red-700 group-hover:block" aria-label="Delete file" onClick={async () => { if (!confirm("Delete this file? Pages using it will lose the image.")) return; const r = await fetch("/api/admin/upload", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: u.name }) }); setUploads((await r.json()).uploads); }}><Trash2 size={15} /></button></li>))}</ul>
          {!uploads.length && <p className="mt-3 text-sm text-ink/60">No uploads yet.</p>}</Card>}

        {tab === "standings" && <Standings c={c} set={set} bar={bar} />}

        {tab === "nav" && <Card title="Main menu" sub="Items with sub-links show as a drop-down."><ListEditor reorder items={c.nav} onChange={(n) => set("nav", n)} blank={{ label: "", href: "/" }} addLabel="Add menu item" render={(n, u) => (<div className="flex-1 space-y-2"><div className="grid gap-2 sm:grid-cols-2"><Field label="Label" value={n.label} onChange={(v) => u({ ...n, label: v })} /><Field label="Link" value={n.href} onChange={(v) => u({ ...n, href: v })} /></div>
          <div className="ml-4 border-l-2 border-grow/50 pl-3"><p className="text-xs font-bold uppercase text-ink/60">Drop-down sub-links</p><ListEditor items={n.children ?? []} onChange={(ch) => u({ ...n, children: ch.length ? ch : undefined })} blank={{ label: "", href: "/" }} addLabel="Add sub-link" render={(s, uu) => <div className="grid flex-1 gap-2 sm:grid-cols-2"><Field label="Label" value={s.label} onChange={(v) => uu({ ...s, label: v })} /><Field label="Link" value={s.href} onChange={(v) => uu({ ...s, href: v })} /></div>} /></div></div>)} />{bar("nav")}</Card>}

        {tab === "legal" && <Card title="Privacy policy & terms" sub="Leave a blank line between paragraphs."><div className="grid gap-4"><Area label="Privacy policy" rows={9} value={c.legal.privacy} onChange={(v) => set("legal", { ...c.legal, privacy: v })} /><Area label="Terms of use" rows={9} value={c.legal.terms} onChange={(v) => set("legal", { ...c.legal, terms: v })} /></div>{bar("legal")}</Card>}

        {tab === "messages" && <Card title={`Contact-form messages (${msgs.length})`}>{!msgs.length && <p className="text-ink/70">No messages yet. Messages sent from the website contact form appear here.</p>}
          <ul className="space-y-3">{msgs.map((m) => (<li key={m.id} className={`border p-4 ${m.read ? "border-navy/10 bg-white" : "border-grow bg-[#f2f8e8]"}`}>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm"><b className="text-navy">{m.name}</b><a className="underline" href={`mailto:${m.email}?subject=Re: your ${m.topic} enquiry`}>{m.email}</a><span className="bg-navy px-2 py-0.5 text-xs font-bold text-white">{m.topic}</span><span className="ml-auto text-ink/60">{new Date(m.date).toLocaleString()}</span></div>
            <p className="mt-2 whitespace-pre-wrap">{m.message}</p>
            <div className="mt-3 flex gap-4 text-sm"><a className="inline-flex items-center gap-1 font-semibold underline" href={`mailto:${m.email}?subject=Re: your ${m.topic} enquiry`}><Mail size={14} />Reply</a>
              <button className="inline-flex items-center gap-1 underline" onClick={async () => { await fetch("/api/admin/messages", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: m.id, read: !m.read }) }); setMsgs(msgs.map((x) => (x.id === m.id ? { ...x, read: !m.read } : x))); }}><Check size={14} />{m.read ? "Mark unread" : "Mark read"}</button>
              <button className="inline-flex items-center gap-1 text-red-700 underline" onClick={async () => { if (!confirm("Delete this message?")) return; await fetch("/api/admin/messages", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: m.id }) }); setMsgs(msgs.filter((x) => x.id !== m.id)); }}><Trash2 size={14} />Delete</button></div></li>))}</ul></Card>}

        {tab === "account" && <Account />}
      </div></div>
    {picker && <Picker uploads={uploads} onUpload={upload} onClose={() => setPicker(null)} onPick={(u) => { picker(u); setPicker(null); }} />}
  </div>);
}

function Account() {
  const [cur, setCur] = useState(""); const [nw, setNw] = useState(""); const [msg, setMsg] = useState("");
  return (<Card title="Change admin password"><div className="grid max-w-md gap-4"><Field label="Current password" type="password" value={cur} onChange={setCur} /><Field label="New password (min. 8 characters)" type="password" value={nw} onChange={setNw} />
    <button className="btn-g w-fit" onClick={async () => { const r = await fetch("/api/admin/password", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ current: cur, next: nw }) }); const j = await r.json(); setMsg(r.ok ? "Password updated." : j.error); if (r.ok) { setCur(""); setNw(""); } }}>Update password</button>{msg && <p role="status" className="text-sm font-semibold text-navy">{msg}</p>}</div></Card>);
}

const calc = (r: Row): Row => ({ ...r, gd: r.f - r.a, pts: r.w * 3 + r.d, p: r.w + r.d + r.l });
function Standings({ c, set, bar }: { c: Content; set: <K extends keyof Content>(k: K, v: Content[K]) => void; bar: (s: keyof Content, e?: string) => React.ReactNode }) {
  const groups = Object.keys(c.standings); const [g, setG] = useState(groups[0]); const [si, setSi] = useState(0);
  const seasons = c.standings[g] ?? []; const s = seasons[si];
  const put = (list: Season[]) => set("standings", { ...c.standings, [g]: list });
  const upS = (p: Partial<Season>) => put(seasons.map((x, i) => (i === si ? { ...x, ...p } : x)));
  const rank = (rows: Row[]) => [...rows].sort((a, b) => b.pts - a.pts || b.gd - a.gd || b.f - a.f).map((r, i) => ({ ...r, pos: i + 1 }));
  const cols: (keyof Row)[] = ["w", "d", "l", "f", "a"];
  return (<Card title="League tables" sub="Enter wins, draws, losses, goals for/against, then press “Auto-calculate” to fill played, goal difference, points and positions.">
    <div className="flex flex-wrap gap-2">{groups.map((k) => <button key={k} onClick={() => { setG(k); setSi(0); }} className={`min-h-[40px] px-4 text-sm font-bold capitalize ${g === k ? "bg-navy text-white" : "bg-mist text-navy"}`}>{k === "girls" ? "Girls & netball" : k}</button>)}</div>
    <div className="mt-3 flex flex-wrap items-center gap-2">{seasons.map((x, i) => <button key={i} onClick={() => setSi(i)} className={`min-h-[36px] border-b-2 px-3 text-sm font-semibold ${si === i ? "border-grow bg-white text-navy" : "border-transparent bg-mist"}`}>{x.title}</button>)}
      <button className="inline-flex items-center gap-1 px-3 text-sm font-semibold underline" onClick={() => { put([{ season: "New season", title: "New season", rows: [] }, ...seasons]); setSi(0); }}><Plus size={14} />Add season</button></div>
    {s ? <div className="mt-4"><div className="grid gap-3 sm:grid-cols-2"><Field label="Tab label (e.g. Season 6)" value={s.season} onChange={(v) => upS({ season: v })} /><Field label="Table title" value={s.title} onChange={(v) => upS({ title: v })} /></div>
      <div className="mt-4 overflow-x-auto"><table className="w-full min-w-[720px] text-sm"><thead className="bg-navy text-left text-xs uppercase text-white"><tr><th className="p-2">#</th><th className="p-2">Club</th><th className="p-2">P</th>{cols.map((k) => <th key={k} className="p-2 uppercase">{k}</th>)}<th className="p-2">GD</th><th className="p-2">Pts</th><th /></tr></thead>
        <tbody>{s.rows.map((r, i) => { const up = (p: Partial<Row>) => upS({ rows: s.rows.map((x, j) => (j === i ? { ...x, ...p } : x)) }); return (<tr key={i} className="border-b border-mist">
          <td className="p-1"><input aria-label="Position" type="number" className="w-12 border border-navy/20 px-1 py-1" value={r.pos} onChange={(e) => up({ pos: +e.target.value })} /></td>
          <td className="p-1"><input aria-label="Club" className="w-40 border border-navy/20 px-2 py-1" value={r.team} onChange={(e) => up({ team: e.target.value })} /></td>
          <td className="p-1 text-center tabular-nums">{r.p}</td>
          {cols.map((k) => <td key={k} className="p-1"><input aria-label={k} type="number" className="w-14 border border-navy/20 px-1 py-1" value={r[k]} onChange={(e) => up({ [k]: +e.target.value } as Partial<Row>)} /></td>)}
          <td className="p-1 text-center tabular-nums">{r.gd}</td><td className="p-1 text-center font-bold tabular-nums">{r.pts}</td>
          <td className="p-1"><button aria-label="Delete row" className="p-1 text-red-700" onClick={() => upS({ rows: s.rows.filter((_, j) => j !== i) })}><X size={16} /></button></td></tr>); })}</tbody></table></div>
      <div className="mt-3 flex flex-wrap gap-3"><button className="btn-n !min-h-[40px]" onClick={() => upS({ rows: [...s.rows, { pos: s.rows.length + 1, team: "", p: 0, w: 0, d: 0, l: 0, f: 0, a: 0, gd: 0, pts: 0 }] })}><Plus size={16} />Add club</button>
        <button className="btn-g !min-h-[40px]" onClick={() => upS({ rows: rank(s.rows.map(calc)) })}><Trophy size={16} />Auto-calculate &amp; rank</button>
        <button className="px-3 text-sm text-red-700 underline" onClick={() => { if (confirm("Delete this whole season table?")) { put(seasons.filter((_, i) => i !== si)); setSi(0); } }}>Delete season</button></div></div> : <p className="mt-4 text-ink/70">No seasons yet. Add one above.</p>}
    {bar("standings", "Saves the tables for all leagues.")}</Card>);
}
