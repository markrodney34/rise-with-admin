import { NextResponse } from "next/server";
import fs from "node:fs";
import crypto from "node:crypto";
import path from "node:path";
import { isAdmin } from "@/lib/auth";
import { UPLOAD_DIR, listUploads } from "@/lib/content";
const imageTypes: Record<string, string> = { jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png", webp: "image/webp", avif: "image/avif", gif: "image/gif" };
const maxFileBytes = 10 * 1024 * 1024;
const maxTotalBytes = 30 * 1024 * 1024;

function hasImageSignature(bytes: Buffer, ext: string) {
  if (ext === "jpg" || ext === "jpeg") return bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  if (ext === "png") return bytes.length >= 8 && bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
  if (ext === "webp") return bytes.length >= 12 && bytes.toString("ascii", 0, 4) === "RIFF" && bytes.toString("ascii", 8, 12) === "WEBP";
  if (ext === "gif") return bytes.length >= 6 && ["GIF87a", "GIF89a"].includes(bytes.toString("ascii", 0, 6));
  if (ext === "avif") return bytes.length >= 12 && bytes.toString("ascii", 4, 8) === "ftyp" && ["avif", "avis"].includes(bytes.toString("ascii", 8, 12));
  return false;
}

export async function POST(req: Request) {
  if (!await isAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const contentLength = Number(req.headers.get("content-length") || 0);
  if (contentLength > maxTotalBytes + 1024 * 1024) return NextResponse.json({ error: "Upload request is too large." }, { status: 413 });
  let form: FormData;
  try { form = await req.formData(); } catch { return NextResponse.json({ error: "Invalid upload request." }, { status: 400 }); }
  const files = form.getAll("files").filter((f): f is File => f instanceof File);
  if (!files.length || files.length > 6) return NextResponse.json({ error: "Choose between 1 and 6 images." }, { status: 400 });
  if (files.reduce((sum, file) => sum + file.size, 0) > maxTotalBytes) return NextResponse.json({ error: "Combined image size must be 30 MB or less." }, { status: 413 });
  const prepared: { file: File; bytes: Buffer; ext: string }[] = [];
  for (const file of files) {
    const ext = file.name.split(".").pop()?.toLowerCase() || "";
    if (!imageTypes[ext] || file.type.toLowerCase() !== imageTypes[ext]) return NextResponse.json({ error: `${file.name}: use JPG, PNG, WEBP, AVIF or GIF.` }, { status: 400 });
    if (!file.size || file.size > maxFileBytes) return NextResponse.json({ error: `${file.name} must be 10 MB or smaller.` }, { status: 400 });
    const bytes = Buffer.from(await file.arrayBuffer());
    if (!hasImageSignature(bytes, ext)) return NextResponse.json({ error: `${file.name}: file contents do not match its image type.` }, { status: 400 });
    prepared.push({ file, bytes, ext });
  }
  const out: string[] = [];
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  for (const item of prepared) {
    const name = `${Date.now()}-${crypto.randomUUID()}.${item.ext}`;
    fs.writeFileSync(path.join(UPLOAD_DIR, name), item.bytes, { flag: "wx", mode: 0o644 });
    out.push(`/uploads/${name}`);
  }
  return NextResponse.json({ ok: true, urls: out, uploads: listUploads() });
}
export async function DELETE(req: Request) {
  if (!await isAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { name } = await req.json().catch(() => ({ name: "" }));
  const safe = String(name).match(/^\d+-[0-9a-f-]{36}\.(?:jpe?g|png|webp|avif|gif)$/i)?.[0];
  if (safe) { const file = path.join(UPLOAD_DIR, safe); if (fs.existsSync(file)) fs.unlinkSync(file); }
  return NextResponse.json({ ok: true, uploads: listUploads() });
}
