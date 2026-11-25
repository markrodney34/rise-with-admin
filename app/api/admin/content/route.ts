import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { isAdmin } from "@/lib/auth";
import { getContent, saveContent, listUploads } from "@/lib/content";
import type { Content } from "@/lib/types";
const KEYS: (keyof Content)[] = ["site", "home", "about", "leagues", "milestones", "partners", "funders", "images", "highlights", "nav", "legal", "girlsReasons", "standings"];
export async function GET() { if (!isAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); return NextResponse.json({ content: getContent(), uploads: listUploads() }); }
// PUT { section: "home", value: {...} } replaces one section of the site content and refreshes the public pages.
export async function PUT(req: Request) {
  if (!isAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { section, value } = await req.json().catch(() => ({}));
  if (!KEYS.includes(section) || value === undefined || value === null) return NextResponse.json({ error: "Invalid section" }, { status: 400 });
  const c = getContent(); (c as unknown as Record<string, unknown>)[section] = value; saveContent(c);
  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true });
}
