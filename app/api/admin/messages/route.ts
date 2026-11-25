import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { getMessages, saveMessages } from "@/lib/content";
export async function GET() { if (!await isAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); return NextResponse.json({ messages: getMessages() }); }
export async function PATCH(req: Request) { if (!await isAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json().catch(() => null);
  if (!body || typeof body.id !== "string" || typeof body.read !== "boolean") return NextResponse.json({ error: "Invalid message update." }, { status: 400 });
  saveMessages(getMessages().map((m) => (m.id === body.id ? { ...m, read: body.read } : m))); return NextResponse.json({ ok: true }); }
export async function DELETE(req: Request) { if (!await isAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json().catch(() => null);
  if (!body || typeof body.id !== "string") return NextResponse.json({ error: "Invalid message id." }, { status: 400 });
  saveMessages(getMessages().filter((m) => m.id !== body.id)); return NextResponse.json({ ok: true }); }
