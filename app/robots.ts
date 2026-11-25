import type { MetadataRoute } from "next/types"; import { getContent } from "@/lib/content";
export default function robots(): MetadataRoute.Robots { const { site } = getContent(); return { rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/api/"] }, sitemap: `${site.url}/sitemap.xml` }; }
