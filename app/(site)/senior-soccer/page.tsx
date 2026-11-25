import type { Metadata } from "next"; import LeaguePage from "@/components/LeaguePage"; import { getContent } from "@/lib/content";
export function generateMetadata(): Metadata { const l = getContent().leagues["senior-soccer"]; return { title: l.name, description: l.blurb, alternates: { canonical: "/senior-soccer" } }; }
export default function Page() { return <LeaguePage k="senior-soccer" />; }
