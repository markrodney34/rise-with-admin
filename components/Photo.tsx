"use client";
import Image from "next/image";
import manifest from "@/lib/assets.generated.json"; import { useContent } from "./ContentProvider";
const tones = [["#123b31","#397c79"],["#102b25","#79b934"],["#397c79","#123b31"],["#1b5a3a","#183d30"]];
// Renders the photo set for this slot in the admin (or a file in public/images named after the slot), or pitch-line artwork if none.
export default function Photo({ slot, tone = 0, priority = false, className = "", sizes = "100vw" }: { slot: string; tone?: number; priority?: boolean; className?: string; sizes?: string }) {
  const { images } = useContent();
  const base = images[slot] ?? { src: "", alt: slot }; const src = base.src || (manifest.images as Record<string, string>)[slot]; const alt = base.alt || "RISE Sports Foundation photo"; const [a, b] = tones[tone % 4];
  if (src) return <Image src={src} alt={alt} fill priority={priority} sizes={sizes} className={`object-cover ${className}`} />;
  return (
    <div role="img" aria-label={`${alt} (photo placeholder)`} className={`absolute inset-0 ${className}`} style={{ background: `linear-gradient(135deg,${a},${b})` }}>
      <svg className="h-full w-full opacity-25" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" fill="none" stroke="#fff" strokeWidth="3" aria-hidden>
        <rect x="20" y="20" width="360" height="260" /><line x1="200" y1="20" x2="200" y2="280" /><circle cx="200" cy="150" r="46" /><rect x="20" y="95" width="60" height="110" /><rect x="320" y="95" width="60" height="110" />
      </svg>
    </div>
  );
}
