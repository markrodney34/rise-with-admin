import { NextResponse } from "next/server";
import { checkPassword, makeToken, COOKIE_NAME, sessionSecretConfigured } from "@/lib/auth";
import { clientIp } from "@/lib/client-ip";

const tries = new Map<string, { count: number; started: number }>();
const windowMs = 15 * 60 * 1000;
const maxAttempts = 8;

function prune(now: number) {
  if (tries.size < 5000) return;
  for (const [key, entry] of tries) if (now - entry.started >= windowMs) tries.delete(key);
}

export async function POST(req: Request) {
  if (process.env.NODE_ENV === "production" && (!sessionSecretConfigured() || !process.env.SUPABASE_URL || !process.env.SUPABASE_SECRET_KEY)) return NextResponse.json({ error: "Admin login is not configured on this server." }, { status: 503 });
  const now = Date.now();
  prune(now);
  const key = clientIp(req);
  if (tries.size >= 10000 && !tries.has(key)) return NextResponse.json({ error: "Login is temporarily unavailable. Try again shortly." }, { status: 503 });
  const previous = tries.get(key);
  const active = previous && now - previous.started < windowMs;
  if (active && previous.count >= maxAttempts) return NextResponse.json({ error: "Too many attempts. Try again in 15 minutes." }, { status: 429 });

  const body = await req.json().catch(() => null);
  const password = typeof body?.password === "string" ? body.password : "";
  if (!await checkPassword(password)) {
    tries.set(key, { count: (active ? previous.count : 0) + 1, started: active ? previous.started : now });
    return NextResponse.json({ error: "Wrong password." }, { status: 401 });
  }

  tries.delete(key);
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE_NAME, await makeToken(), { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 60 * 60 * 12 });
  return res;
}
