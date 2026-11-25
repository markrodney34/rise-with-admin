import type { MetadataRoute } from "next/types"; import { getContent } from "@/lib/content";
export default function sitemap(): MetadataRoute.Sitemap { const { site } = getContent(); return ["", "/about", "/highlights", "/senior-soccer", "/junior-soccer", "/girls-soccer", "/contact", "/privacy", "/terms"].map((p) => ({ url: site.url + p })); }
