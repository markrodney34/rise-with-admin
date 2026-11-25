import { NextResponse } from "next/server";
import { checkPassword, makeToken, COOKIE_NAME } from "@/lib/auth";
const tries = new Map<string, { n: number; t: number }>();
export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for") ?? "local"; const now = Date.now(); const r = tries.get(ip);
  const live = r && now - r.t < 15 * 60 * 1000;
  if (live && r.n >= 8) return NextResponse.json({ error: "Too many attempts. Try again in 15 minutes." }, { status: 429 });
  const { password } = await req.json().catch(() => ({ password: "" }));
  if (!checkPassword(String(password ?? ""))) { tries.set(ip, { n: (live ? r.n : 0) + 1, t: live ? r.t : now }); return NextResponse.json({ error: "Wrong password." }, { status: 401 }); }
  tries.delete(ip);
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE_NAME, makeToken(), { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 60 * 60 * 12 });
  return res;
}
