import { NextResponse } from "next/server";
import { z } from "zod";
import crypto from "node:crypto";
import { addMessage } from "@/lib/content";
import { clientIp } from "@/lib/client-ip";
const schema = z.object({ name: z.string().min(2).max(120), email: z.string().email().max(200), topic: z.enum(["General", "Partnership", "Volunteer"]), message: z.string().min(10).max(5000), website: z.string().optional() });
const hits = new Map<string, number[]>();
export async function POST(req: Request) {
  const contentLength = Number(req.headers.get("content-length") || 0);
  if (contentLength > 16 * 1024) return NextResponse.json({ error: "Message is too large." }, { status: 413 });
  const ip = clientIp(req); const now = Date.now();
  if (hits.size >= 10000 && !hits.has(ip)) {
    for (const [key, entries] of hits) if (!entries.some((t) => now - t < 10 * 60 * 1000)) hits.delete(key);
    if (hits.size >= 10000) return NextResponse.json({ error: "Message service is temporarily busy." }, { status: 503 });
  }
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 10 * 60 * 1000);
  if (recent.length >= 5) return NextResponse.json({ error: "Too many messages. Please try later." }, { status: 429 });
  const p = schema.safeParse(await req.json().catch(() => null)); if (!p.success) return NextResponse.json({ error: "Please check the form and try again." }, { status: 400 });
  if (p.data.website) return NextResponse.json({ ok: true }); // honeypot
  hits.set(ip, [...recent, now]);
  const { website, ...m } = p.data; void website;
  await addMessage({ id: crypto.randomUUID(), ...m, date: new Date().toISOString(), read: false });
  return NextResponse.json({ ok: true });
}
