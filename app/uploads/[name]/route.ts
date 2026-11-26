import { downloadUpload } from "@/lib/content";
const types: Record<string, string> = { jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png", webp: "image/webp", avif: "image/avif", gif: "image/gif" };
export async function GET(_: Request, { params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  if (!/^\d+-[0-9a-f-]{36}\.(?:jpe?g|png|webp|avif|gif)$/i.test(name)) return new Response("Not found", { status: 404 });
  const file = await downloadUpload(name);
  if (!file) return new Response("Not found", { status: 404 });
  const ext = name.split(".").pop()!.toLowerCase();
  return new Response(file, { headers: { "Content-Type": types[ext] ?? "application/octet-stream", "X-Content-Type-Options": "nosniff", "Cache-Control": "public, max-age=31536000, immutable" } });
}
