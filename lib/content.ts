import fs from "node:fs";
import path from "node:path";
import type { Content, Message } from "./types";

// All editable content lives in /content (JSON files + uploads). Set DATA_DIR to put it on a persistent disk.
export const DATA_DIR = process.env.DATA_DIR || path.join(process.cwd(), "content");
const SITE_FILE = path.join(DATA_DIR, "site.json");
const MSG_FILE = path.join(DATA_DIR, "messages.json");
export const UPLOAD_DIR = path.join(DATA_DIR, "uploads");

function ensure() { fs.mkdirSync(UPLOAD_DIR, { recursive: true }); if (!fs.existsSync(SITE_FILE)) fs.copyFileSync(path.join(process.cwd(), "content", "site.json"), SITE_FILE); }
function writeAtomic(file: string, data: unknown) { const tmp = file + ".tmp"; fs.writeFileSync(tmp, JSON.stringify(data, null, 1)); fs.renameSync(tmp, file); }

export function getContent(): Content {
  ensure();
  const c = JSON.parse(fs.readFileSync(SITE_FILE, "utf8")) as Content;
  // Uploaded photo slots: a file named after a slot in /public/images still overrides (legacy behaviour)
  return c;
}
export function saveContent(c: Content) { ensure(); writeAtomic(SITE_FILE, c); }

export function getMessages(): Message[] { ensure(); try { return JSON.parse(fs.readFileSync(MSG_FILE, "utf8")); } catch { return []; } }
export function saveMessages(m: Message[]) { ensure(); writeAtomic(MSG_FILE, m); }
export function listUploads() { ensure(); return fs.readdirSync(UPLOAD_DIR).filter((f) => /\.(jpe?g|png|webp|avif|gif|svg)$/i.test(f)).map((f) => ({ name: f, url: `/uploads/${f}`, time: fs.statSync(path.join(UPLOAD_DIR, f)).mtimeMs })).sort((a, b) => b.time - a.time); }
