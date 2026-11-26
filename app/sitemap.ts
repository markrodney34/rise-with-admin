import type { MetadataRoute } from "next/types"; import { getContent } from "@/lib/content";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> { const { site } = await getContent(); return ["", "/about", "/highlights", "/senior-soccer", "/junior-soccer", "/girls-soccer", "/contact", "/privacy", "/terms"].map((p) => ({ url: site.url + p })); }
