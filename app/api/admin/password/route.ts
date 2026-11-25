import { NextResponse } from "next/server";
import { isAdmin, checkPassword, setPassword } from "@/lib/auth";
export async function POST(req: Request) {
  if (!isAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { current, next } = await req.json().catch(() => ({}));
  if (!checkPassword(String(current ?? ""))) return NextResponse.json({ error: "Current password is wrong." }, { status: 400 });
  if (String(next ?? "").length < 8) return NextResponse.json({ error: "New password must be at least 8 characters." }, { status: 400 });
  setPassword(String(next)); return NextResponse.json({ ok: true });
}
