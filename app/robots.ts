import type { MetadataRoute } from "next/types"; import { getContent } from "@/lib/content";
export default async function robots(): Promise<MetadataRoute.Robots> { const { site } = await getContent(); return { rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/api/"] }, sitemap: `${site.url}/sitemap.xml` }; }
