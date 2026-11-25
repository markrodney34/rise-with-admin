import type { Metadata } from "next/types"; import LeaguePage from "@/components/LeaguePage"; import { getContent } from "@/lib/content";
export function generateMetadata(): Metadata { const l = getContent().leagues["girls-soccer"]; return { title: l.name, description: l.blurb, alternates: { canonical: "/girls-soccer" } }; }
export default function Page() { return <LeaguePage k="girls-soccer" />; }
