"use client";
import { useState } from "react";
import { ArrowDown, ArrowUp, Plus, Trash2, Upload, X } from "lucide-react";

const inp = "mt-1 w-full border-2 border-navy/20 bg-white px-3 py-2 focus:border-blue";
export function Field({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return <label className="block text-sm font-semibold text-navy">{label}<input type={type} value={value} onChange={(e) => onChange(e.target.value)} className={inp + " font-normal text-ink"} /></label>;
}
export function Area({ label, value, onChange, rows = 3 }: { label: string; value: string; onChange: (v: string) => void; rows?: number }) {
  return <label className="block text-sm font-semibold text-navy">{label}<textarea rows={rows} value={value} onChange={(e) => onChange(e.target.value)} className={inp + " font-normal text-ink"} /></label>;
}
export function Card({ title, sub, children }: { title: string; sub?: string; children: React.ReactNode }) {
  return <section className="border-t-4 border-grow bg-white p-5 shadow-lift sm:p-6"><h2 className="font-display text-2xl font-bold uppercase text-navy">{title}</h2>{sub && <p className="mt-1 text-sm text-ink/65">{sub}</p>}<div className="mt-4">{children}</div></section>;
}
export function SaveBar({ state, onSave, note }: { state?: string; onSave: () => void; note?: string }) {
  return <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-mist pt-4"><button onClick={onSave} disabled={state === "saving"} className="btn-g !min-h-[44px] disabled:opacity-60">{state === "saving" ? "Saving…" : "Save & publish"}</button>
    {state === "saved" && <span role="status" className="font-semibold text-grow">✓ Saved. Live on the website.</span>}{state === "error" && <span role="alert" className="font-semibold text-red-700">Could not save. Are you still signed in?</span>}{note && <span className="text-sm text-ink/60">{note}</span>}</div>;
}
export function Reorder({ i, n, onMove, onDelete }: { i: number; n: number; onMove: (a: number, b: number) => void; onDelete: () => void }) {
  const b = "grid h-8 w-8 place-items-center border border-navy/20 bg-white hover:bg-mist disabled:opacity-30";
  return <div className="flex shrink-0 flex-col gap-1"><button className={b} aria-label="Move up" disabled={i === 0} onClick={() => onMove(i, i - 1)}><ArrowUp size={15} /></button><button className={b} aria-label="Move down" disabled={i === n - 1} onClick={() => onMove(i, i + 1)}><ArrowDown size={15} /></button><button className={b + " text-red-700"} aria-label="Delete" onClick={onDelete}><Trash2 size={15} /></button></div>;
}
export function ListEditor<T>({ items, onChange, render, blank, addLabel, reorder = true }: { items: T[]; onChange: (i: T[]) => void; render: (item: T, update: (v: T) => void) => React.ReactNode; blank: T; addLabel: string; reorder?: boolean }) {
  const move = (a: number, b: number) => { const l = [...items]; [l[a], l[b]] = [l[b], l[a]]; onChange(l); };
  return <div className="mt-2 space-y-3">{items.map((it, i) => <div key={i} className="flex gap-3 border border-navy/15 bg-[#fafaf6] p-3">{render(it, (v) => onChange(items.map((x, j) => (j === i ? v : x))))}
    <Reorder i={i} n={items.length} onMove={move} onDelete={() => onChange(items.filter((_, j) => j !== i))} /></div>)}
    <button className="inline-flex items-center gap-1 text-sm font-semibold text-navy underline" onClick={() => onChange([...items, typeof blank === "object" && blank !== null ? { ...blank } : blank])}><Plus size={15} />{addLabel}</button></div>;
}
export function ImageField({ label, value, alt, onPick, onClear, onAlt }: { label: string; value: string; alt: string; onPick: () => void; onClear: () => void; onAlt: (a: string) => void }) {
  return <div className="border border-navy/15 p-3"><p className="text-sm font-semibold text-navy">{label}</p>
    <div className="mt-2 aspect-[16/9] bg-mist bg-cover bg-center" style={value ? { backgroundImage: `url(${value})` } : undefined}>{!value && <span className="grid h-full place-items-center text-xs text-ink/50">Default artwork</span>}</div>
    <div className="mt-2 flex gap-3 text-sm"><button className="font-semibold underline" onClick={onPick}>Choose / upload</button>{value && <button className="text-red-700 underline" onClick={onClear}>Clear</button>}</div>
    <label className="mt-2 block text-xs font-semibold text-ink/70">Description for screen readers<input value={alt} onChange={(e) => onAlt(e.target.value)} className={inp + " !py-1.5 text-sm font-normal"} /></label></div>;
}
export function Picker({ uploads, onUpload, onPick, onClose }: { uploads: { name: string; url: string }[]; onUpload: (f: FileList | null) => Promise<string[]>; onPick: (u: string) => void; onClose: () => void }) {
  const [url, setUrl] = useState(""); const [busy, setBusy] = useState(false);
  return <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4" role="dialog" aria-modal="true" aria-label="Choose image" onClick={onClose}>
    <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto bg-white p-5" onClick={(e) => e.stopPropagation()}>
      <div className="flex items-center justify-between"><h3 className="font-display text-2xl font-bold uppercase text-navy">Choose an image</h3><button aria-label="Close" onClick={onClose}><X /></button></div>
      <label className="btn-g mt-4 cursor-pointer !min-h-[42px]"><Upload size={16} />{busy ? "Uploading…" : "Upload new image"}<input type="file" accept="image/*" hidden onChange={async (e) => { setBusy(true); const u = await onUpload(e.target.files); setBusy(false); if (u[0]) onPick(u[0]); }} /></label>
      <div className="mt-4 flex gap-2"><input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="…or paste an image URL (https://risemayugesports.org/wp-content/uploads/…)" className={inp + " !mt-0"} /><button className="btn-n !min-h-[42px]" disabled={!url} onClick={() => onPick(url.trim())}>Use</button></div>
      <ul className="mt-5 grid grid-cols-3 gap-2 sm:grid-cols-4">{uploads.map((u) => <li key={u.name}><button className="aspect-square w-full bg-mist bg-cover bg-center hover:ring-4 hover:ring-grow" style={{ backgroundImage: `url(${u.url})` }} aria-label={`Use ${u.name}`} onClick={() => onPick(u.url)} /></li>)}</ul>
      {!uploads.length && <p className="mt-4 text-sm text-ink/60">Your library is empty. Upload an image above.</p>}</div></div>;
}
