import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { cookies } from "next/headers";
import { DATA_DIR } from "./content";

const COOKIE = "rise_admin";
const AUTH_FILE = path.join(DATA_DIR, "auth.json");
// Keep the legacy development password usable without putting its text in source.
// This verifier is not a production secret; configure ADMIN_PASSWORD in production.
const FALLBACK_SALT = "84ea39931c74cc99867be1c0828dba35";
const FALLBACK_HASH = "9e682a77b0b5c78a7c04cd378a373773201376912c7df613360fdd2af1a16f5a";

export const usingDefaultPassword = () => !fs.existsSync(AUTH_FILE) && !process.env.ADMIN_PASSWORD;
export const sessionSecretConfigured = () => !!process.env.SESSION_SECRET && process.env.SESSION_SECRET.length >= 32;

function secret() {
  const configured = process.env.SESSION_SECRET;
  if (sessionSecretConfigured()) return configured!;
  if (process.env.NODE_ENV === "production") throw new Error("SESSION_SECRET must be configured with at least 32 characters.");
  if (configured) return configured;
  return "development-only-session-secret";
}

function hash(pw: string, salt: string) { return crypto.scryptSync(pw, salt, 32).toString("hex"); }

export function checkPassword(pw: string) {
  if (!pw || pw.length > 1024) return false;
  try {
    if (fs.existsSync(AUTH_FILE)) {
      const auth = JSON.parse(fs.readFileSync(AUTH_FILE, "utf8")) as { salt?: string; hash?: string };
      if (!auth.salt || !auth.hash) return false;
      return safeEq(hash(pw, auth.salt), auth.hash);
    }
    if (process.env.ADMIN_PASSWORD) return safeEq(pw, process.env.ADMIN_PASSWORD);
    if (process.env.NODE_ENV === "production") return false;
    return safeEq(hash(pw, FALLBACK_SALT), FALLBACK_HASH);
  } catch {
    return false;
  }
}

export function setPassword(pw: string) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  const salt = crypto.randomBytes(16).toString("hex");
  fs.writeFileSync(AUTH_FILE, JSON.stringify({ salt, hash: hash(pw, salt) }), { mode: 0o600 });
  fs.chmodSync(AUTH_FILE, 0o600);
}

function safeEq(a: string, b: string) {
  const x = Buffer.from(a), y = Buffer.from(b);
  return x.length === y.length && crypto.timingSafeEqual(x, y);
}

function passwordVersion() {
  if (fs.existsSync(AUTH_FILE)) {
    try { return JSON.parse(fs.readFileSync(AUTH_FILE, "utf8")).salt as string; } catch { return "invalid-auth-file"; }
  }
  return crypto.createHash("sha256").update(process.env.ADMIN_PASSWORD || FALLBACK_HASH).digest("hex");
}

const sign = (v: string) => crypto.createHmac("sha256", secret()).update(`${v}.${passwordVersion()}`).digest("hex");
export function makeToken() { const exp = String(Date.now() + 1000 * 60 * 60 * 12); return `${exp}.${sign(exp)}`; }
export function validToken(t?: string) {
  if (!t || (process.env.NODE_ENV === "production" && !sessionSecretConfigured())) return false;
  const [exp, sig] = t.split(".");
  return !!exp && !!sig && Number(exp) > Date.now() && safeEq(sig, sign(exp));
}
export async function isAdmin() { return validToken((await cookies()).get(COOKIE)?.value); }
export const COOKIE_NAME = COOKIE;
