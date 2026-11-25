"use client";
import { useState } from "react";
export default function Login({ defaultPw }: { defaultPw: boolean }) {
  const [pw, setPw] = useState(""); const [err, setErr] = useState(""); const [busy, setBusy] = useState(false);
  async function go(e: React.FormEvent) { e.preventDefault(); setBusy(true); setErr("");
    const r = await fetch("/api/admin/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password: pw }) });
    if (r.ok) location.reload(); else { setErr((await r.json()).error ?? "Login failed"); setBusy(false); } }
  return (<div className="grid min-h-screen place-items-center p-6"><form onSubmit={go} className="w-full max-w-sm space-y-4 border-t-4 border-grow bg-white p-8 shadow-lift">
    <div className="flex items-center gap-2.5"><span className="grid h-10 w-10 place-items-center bg-grow font-display text-2xl font-bold text-white">R</span><div><p className="font-display text-xl font-bold uppercase leading-none text-navy">RISE Admin</p><p className="text-xs text-ink/60">Website control panel</p></div></div>
    <label className="block text-sm font-semibold">Password<input type="password" autoFocus value={pw} onChange={(e) => setPw(e.target.value)} className="mt-1 w-full border-2 border-navy/20 px-3 py-2.5 focus:border-blue" /></label>
    {err && <p role="alert" className="text-sm font-semibold text-red-700">{err}</p>}
    <button disabled={busy || !pw} className="btn-g w-full disabled:opacity-50">{busy ? "Signing in…" : "Sign in"}</button>
    {defaultPw && <p className="bg-amber-50 p-3 text-xs text-amber-900">No ADMIN_PASSWORD is set, so the default password <b>rise-admin</b> is active. Set ADMIN_PASSWORD (or change it inside the panel) before going live.</p>}
    <a href="/" className="block text-center text-sm underline">← Back to website</a></form></div>);
}
