import type { Metadata } from "next"; import LeaguePage from "@/components/LeaguePage"; import { getContent } from "@/lib/content";
export function generateMetadata(): Metadata { const l = getContent().leagues["junior-soccer"]; return { title: l.name, description: l.blurb, alternates: { canonical: "/junior-soccer" } }; }
export default function Page() { return <LeaguePage k="junior-soccer" />; }
