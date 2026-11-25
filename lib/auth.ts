import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { cookies } from "next/headers";
import { DATA_DIR } from "./content";

const COOKIE = "rise_admin";
const AUTH_FILE = path.join(DATA_DIR, "auth.json");
// Password: stored (scrypt-hashed) in content/auth.json once changed in the admin; otherwise ADMIN_PASSWORD env; otherwise a dev default.
export const usingDefaultPassword = () => !fs.existsSync(AUTH_FILE) && !process.env.ADMIN_PASSWORD;
function secret() { return process.env.SESSION_SECRET || process.env.ADMIN_PASSWORD || (fs.existsSync(AUTH_FILE) ? JSON.parse(fs.readFileSync(AUTH_FILE, "utf8")).salt : "rise-dev-secret"); }
function hash(pw: string, salt: string) { return crypto.scryptSync(pw, salt, 32).toString("hex"); }
export function checkPassword(pw: string) {
  if (fs.existsSync(AUTH_FILE)) { const a = JSON.parse(fs.readFileSync(AUTH_FILE, "utf8")); return safeEq(hash(pw, a.salt), a.hash); }
  return safeEq(pw, process.env.ADMIN_PASSWORD || "rise-admin");
}
export function setPassword(pw: string) { fs.mkdirSync(DATA_DIR, { recursive: true }); const salt = crypto.randomBytes(16).toString("hex"); fs.writeFileSync(AUTH_FILE, JSON.stringify({ salt, hash: hash(pw, salt) })); }
function safeEq(a: string, b: string) { const x = Buffer.from(a), y = Buffer.from(b); return x.length === y.length && crypto.timingSafeEqual(x, y); }
const sign = (v: string) => crypto.createHmac("sha256", secret()).update(v).digest("hex");
export function makeToken() { const exp = String(Date.now() + 1000 * 60 * 60 * 12); return `${exp}.${sign(exp)}`; }
export function validToken(t?: string) { if (!t) return false; const [exp, sig] = t.split("."); return !!exp && !!sig && Number(exp) > Date.now() && safeEq(sig, sign(exp)); }
export function isAdmin() { return validToken(cookies().get(COOKIE)?.value); }
export const COOKIE_NAME = COOKIE;
