import type { Metadata } from "next/types"; import LeaguePage from "@/components/LeaguePage"; import { getContent } from "@/lib/content";
export async function generateMetadata(): Promise<Metadata> { const l = (await getContent()).leagues["senior-soccer"]; return { title: l.name, description: l.blurb, alternates: { canonical: "/senior-soccer" } }; }
export default function Page() { return <LeaguePage k="senior-soccer" />; }
