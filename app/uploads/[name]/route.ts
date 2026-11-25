import fs from "node:fs";
import path from "node:path";
import { UPLOAD_DIR } from "@/lib/content";
const types: Record<string, string> = { jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png", webp: "image/webp", avif: "image/avif", gif: "image/gif" };
export async function GET(_: Request, { params }: { params: Promise<{ name: string }> }) {
  const { name: fileName } = await params;
  const name = path.basename(fileName); const f = path.join(UPLOAD_DIR, name);
  if (!fs.existsSync(f)) return new Response("Not found", { status: 404 });
  return new Response(new Uint8Array(fs.readFileSync(f)), { headers: { "Content-Type": types[name.split(".").pop()!.toLowerCase()] ?? "application/octet-stream", "X-Content-Type-Options": "nosniff", "Cache-Control": "public, max-age=31536000, immutable" } });
}
