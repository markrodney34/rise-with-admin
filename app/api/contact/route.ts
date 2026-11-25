import { NextResponse } from "next/server";
import { z } from "zod";
import crypto from "node:crypto";
import { getMessages, saveMessages } from "@/lib/content";
const schema = z.object({ name: z.string().min(2).max(120), email: z.string().email().max(200), topic: z.enum(["General", "Partnership", "Volunteer"]), message: z.string().min(10).max(5000), website: z.string().optional() });
const hits = new Map<string, number[]>();
export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for") ?? "local"; const now = Date.now(); const recent = (hits.get(ip) ?? []).filter((t) => now - t < 10 * 60 * 1000);
  if (recent.length >= 5) return NextResponse.json({ error: "Too many messages. Please try later." }, { status: 429 });
  const p = schema.safeParse(await req.json().catch(() => null)); if (!p.success) return NextResponse.json({ error: "Please check the form and try again." }, { status: 400 });
  if (p.data.website) return NextResponse.json({ ok: true }); // honeypot
  hits.set(ip, [...recent, now]);
  const { website, ...m } = p.data; void website;
  saveMessages([{ id: crypto.randomUUID(), ...m, date: new Date().toISOString(), read: false }, ...getMessages()].slice(0, 1000));
  return NextResponse.json({ ok: true });
}
