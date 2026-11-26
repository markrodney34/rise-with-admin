import { createClient } from "@supabase/supabase-js";
import fs from "node:fs/promises";
import path from "node:path";

const url = process.env.SUPABASE_URL;
const secret = process.env.SUPABASE_SECRET_KEY;
if (!url || !secret) throw new Error("Set SUPABASE_URL and SUPABASE_SECRET_KEY before running this migration.");
const supabase = createClient(url, secret, { auth: { persistSession: false, autoRefreshToken: false } });
const root = process.cwd();
const readJson = async (file) => JSON.parse(await fs.readFile(path.join(root, file), "utf8"));
const uploadDir = path.join(root, "content", "uploads");
const mime = { jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png", webp: "image/webp", avif: "image/avif", gif: "image/gif" };

const content = await readJson("content/site.json");
let result = await supabase.from("site_content").select("id").eq("id", "main").maybeSingle();
if (result.error) throw result.error;
if (result.data) console.log("Kept existing Supabase site content.");
else {
  result = await supabase.from("site_content").insert({ id: "main", content });
  if (result.error) throw result.error;
  console.log("Migrated site content.");
}

try {
  const messages = await readJson("content/messages.json");
  if (Array.isArray(messages) && messages.length) {
    const rows = messages.map((m) => ({ id: m.id, name: m.name, email: m.email, topic: m.topic, message: m.message, created_at: m.date, is_read: !!m.read }));
    result = await supabase.from("contact_messages").upsert(rows, { onConflict: "id", ignoreDuplicates: true });
    if (result.error) throw result.error;
    console.log(`Migrated ${rows.length} contact messages.`);
  }
} catch (error) {
  if (error.code !== "ENOENT") throw error;
  console.log("No local message file found.");
}

try {
  const auth = await readJson("content/auth.json");
  if (auth.salt && auth.hash) {
    result = await supabase.from("admin_credentials").upsert({ id: "primary", salt: auth.salt, password_hash: auth.hash, updated_at: new Date().toISOString() });
    if (result.error) throw result.error;
    console.log("Migrated the existing admin password hash.");
  }
} catch (error) {
  if (error.code !== "ENOENT") throw error;
  console.log("No local password hash found; admin login will use configured ADMIN_PASSWORD until changed in the panel.");
}

let uploaded = 0;
try {
  for (const entry of await fs.readdir(uploadDir, { withFileTypes: true })) {
    if (!entry.isFile()) continue;
    const ext = path.extname(entry.name).slice(1).toLowerCase();
    if (!mime[ext]) continue;
    const bytes = await fs.readFile(path.join(uploadDir, entry.name));
    if (!bytes.length || bytes.length > 10 * 1024 * 1024) throw new Error(`Upload ${entry.name} exceeds the 10 MB bucket limit.`);
    result = await supabase.storage.from("rise-uploads").upload(entry.name, bytes, { contentType: mime[ext], upsert: true, cacheControl: "31536000" });
    if (result.error) throw result.error;
    uploaded++;
  }
} catch (error) {
  if (error.code !== "ENOENT") throw error;
}
console.log(`Migrated ${uploaded} uploaded images.`);
