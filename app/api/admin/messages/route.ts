import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { getMessages, saveMessages } from "@/lib/content";
export async function GET() { if (!isAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); return NextResponse.json({ messages: getMessages() }); }
export async function PATCH(req: Request) { if (!isAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id, read } = await req.json(); saveMessages(getMessages().map((m) => (m.id === id ? { ...m, read: !!read } : m))); return NextResponse.json({ ok: true }); }
export async function DELETE(req: Request) { if (!isAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await req.json(); saveMessages(getMessages().filter((m) => m.id !== id)); return NextResponse.json({ ok: true }); }
