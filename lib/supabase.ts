import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let adminClient: SupabaseClient | undefined;

export function isSupabaseConfigured() {
  return !!process.env.SUPABASE_URL?.trim() && !!process.env.SUPABASE_SECRET_KEY?.trim();
}

export function getSupabaseAdmin() {
  const url = process.env.SUPABASE_URL?.trim();
  const secret = process.env.SUPABASE_SECRET_KEY?.trim();
  if (!url || !secret) throw new Error("Configure SUPABASE_URL and SUPABASE_SECRET_KEY on the server.");
  if (!adminClient) {
    adminClient = createClient(url, secret, {
      auth: { autoRefreshToken: false, persistSession: false, detectSessionInUrl: false },
    });
  }
  return adminClient;
}
