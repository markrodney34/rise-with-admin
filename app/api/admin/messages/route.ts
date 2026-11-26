import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { getMessages, setMessageRead, deleteMessage } from "@/lib/content";
export async function GET() { if (!await isAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); return NextResponse.json({ messages: await getMessages() }); }
export async function PATCH(req: Request) { if (!await isAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json().catch(() => null);
  if (!body || typeof body.id !== "string" || typeof body.read !== "boolean") return NextResponse.json({ error: "Invalid message update." }, { status: 400 });
  await setMessageRead(body.id, body.read); return NextResponse.json({ ok: true }); }
export async function DELETE(req: Request) { if (!await isAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json().catch(() => null);
  if (!body || typeof body.id !== "string") return NextResponse.json({ error: "Invalid message id." }, { status: 400 });
  await deleteMessage(body.id); return NextResponse.json({ ok: true }); }
