import { NextResponse } from "next/server";
import { isAdmin, checkPassword, setPassword } from "@/lib/auth";
export async function POST(req: Request) {
  if (!await isAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json().catch(() => null);
  if (!body || typeof body.current !== "string" || typeof body.next !== "string") return NextResponse.json({ error: "Invalid password update." }, { status: 400 });
  if (!await checkPassword(body.current)) return NextResponse.json({ error: "Current password is wrong." }, { status: 400 });
  if (body.next.length < 12 || body.next.length > 256) return NextResponse.json({ error: "New password must be between 12 and 256 characters." }, { status: 400 });
  await setPassword(body.next); return NextResponse.json({ ok: true });
}
