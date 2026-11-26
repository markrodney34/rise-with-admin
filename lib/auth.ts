import crypto from "node:crypto";
import { cookies } from "next/headers";
import { getSupabaseAdmin, isSupabaseConfigured } from "./supabase";

const COOKIE = "rise_admin";
const FALLBACK_SALT = "84ea39931c74cc99867be1c0828dba35";
const FALLBACK_HASH = "9e682a77b0b5c78a7c04cd378a373773201376912c7df613360fdd2af1a16f5a";
export const COOKIE_NAME = COOKIE;
export const sessionSecretConfigured = () => !!process.env.SESSION_SECRET?.trim() && process.env.SESSION_SECRET.trim().length >= 32;
const hash = (pw: string, salt: string) => crypto.scryptSync(pw, salt, 32).toString("hex");
function safeEq(a: string, b: string) { const x = Buffer.from(a), y = Buffer.from(b); return x.length === y.length && crypto.timingSafeEqual(x, y); }
async function credential() {
  if (!isSupabaseConfigured()) return null;
  const { data, error } = await getSupabaseAdmin().from("admin_credentials").select("salt,password_hash").eq("id", "primary").maybeSingle();
  if (error) throw new Error(`Could not read admin credentials from Supabase: ${error.message}`);
  return data as { salt: string; password_hash: string } | null;
}
export async function usingDefaultPassword() {
  if (process.env.ADMIN_PASSWORD) return false;
  if (process.env.NODE_ENV === "production") return !(await credential());
  return !(await credential());
}
export async function checkPassword(pw: string) {
  if (!pw || pw.length > 1024) return false;
  const stored = await credential();
  if (stored) return safeEq(hash(pw, stored.salt), stored.password_hash);
  if (process.env.ADMIN_PASSWORD) return safeEq(pw, process.env.ADMIN_PASSWORD);
  if (process.env.NODE_ENV === "production") return false;
  return safeEq(hash(pw, FALLBACK_SALT), FALLBACK_HASH);
}
export async function setPassword(pw: string) {
  const salt = crypto.randomBytes(16).toString("hex");
  const { error } = await getSupabaseAdmin().from("admin_credentials").upsert({ id: "primary", salt, password_hash: hash(pw, salt), updated_at: new Date().toISOString() });
  if (error) throw new Error(`Could not update admin credentials in Supabase: ${error.message}`);
}
function sessionSecret() {
  if (sessionSecretConfigured()) return process.env.SESSION_SECRET!.trim();
  if (process.env.NODE_ENV === "production") throw new Error("SESSION_SECRET must be configured with at least 32 characters.");
  return process.env.SESSION_SECRET || "development-only-session-secret";
}
async function passwordVersion() {
  const stored = await credential();
  return stored?.salt ?? crypto.createHash("sha256").update(process.env.ADMIN_PASSWORD || FALLBACK_HASH).digest("hex");
}
async function sign(value: string) { return crypto.createHmac("sha256", sessionSecret()).update(`${value}.${await passwordVersion()}`).digest("hex"); }
export async function makeToken() { const exp = String(Date.now() + 12 * 60 * 60 * 1000); return `${exp}.${await sign(exp)}`; }
export async function validToken(token?: string) {
  if (!token || (process.env.NODE_ENV === "production" && !sessionSecretConfigured())) return false;
  const [exp, sig] = token.split(".");
  return !!exp && !!sig && Number(exp) > Date.now() && safeEq(sig, await sign(exp));
}
export async function isAdmin() { return validToken((await cookies()).get(COOKIE)?.value); }
