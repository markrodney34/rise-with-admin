// Scans public/images and public/logos and writes lib/assets.generated.json. Runs before dev/build.
import fs from "node:fs"; import path from "node:path";
const ok = /\.(jpe?g|png|webp|avif|svg)$/i; const out = { images: {}, logo: null };
const scan = (d) => (fs.existsSync(d) ? fs.readdirSync(d).filter((f) => ok.test(f)) : []);
for (const f of scan("public/images")) out.images[f.replace(/\.[^.]+$/, "").toLowerCase()] = `/images/${f}`;
const l = scan("public/logos").find((f) => /rise|logo/i.test(f)) ?? scan("public/logos")[0]; if (l) out.logo = `/logos/${l}`;
fs.writeFileSync("lib/assets.generated.json", JSON.stringify(out, null, 2)); console.log("assets:", Object.keys(out.images).length, "images, logo:", out.logo ?? "none");
