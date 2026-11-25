import { NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";
import { isAdmin } from "@/lib/auth";
import { UPLOAD_DIR, listUploads } from "@/lib/content";
const OK = /\.(jpe?g|png|webp|avif|gif)$/i;
export async function POST(req: Request) {
  if (!isAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const form = await req.formData(); const files = form.getAll("files").filter((f): f is File => f instanceof File); const out: string[] = [];
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  for (const f of files) {
    if (!OK.test(f.name) || !f.type.startsWith("image/")) return NextResponse.json({ error: `${f.name}: only JPG, PNG, WEBP, AVIF or GIF images.` }, { status: 400 });
    if (f.size > 10 * 1024 * 1024) return NextResponse.json({ error: `${f.name} is over 10 MB.` }, { status: 400 });
    const name = `${Date.now()}-${f.name.toLowerCase().replace(/[^a-z0-9.]+/g, "-").replace(/^-+/, "")}`;
    fs.writeFileSync(path.join(UPLOAD_DIR, name), Buffer.from(await f.arrayBuffer())); out.push(`/uploads/${name}`);
  }
  return NextResponse.json({ ok: true, urls: out, uploads: listUploads() });
}
export async function DELETE(req: Request) {
  if (!isAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { name } = await req.json().catch(() => ({ name: "" })); const safe = path.basename(String(name));
  const f = path.join(UPLOAD_DIR, safe); if (fs.existsSync(f)) fs.unlinkSync(f);
  return NextResponse.json({ ok: true, uploads: listUploads() });
}
