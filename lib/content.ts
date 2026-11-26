import "server-only";
import { cache } from "react";
import fs from "node:fs";
import path from "node:path";
import type { Content, Message } from "./types";
import { getSupabaseAdmin, isSupabaseConfigured } from "./supabase";

const seedFile = path.join(process.cwd(), "content", "site.json");
const uploadBucket = "rise-uploads";

function readSeedContent(): Content {
  return JSON.parse(fs.readFileSync(seedFile, "utf8")) as Content;
}

function throwOnError(error: { message: string } | null) {
  if (error) throw new Error(`Supabase request failed: ${error.message}`);
}

export const getContent = cache(async (): Promise<Content> => {
  if (!isSupabaseConfigured()) return readSeedContent();
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.from("site_content").select("content").eq("id", "main").maybeSingle();
  throwOnError(error);
  if (data?.content) return data.content as Content;

  // Seed the first Supabase project from the checked-in starter content.
  const seed = readSeedContent();
  const { error: seedError } = await supabase.from("site_content").upsert({ id: "main", content: seed });
  throwOnError(seedError);
  return seed;
});

export async function saveContentSection(section: keyof Content, value: Content[keyof Content]) {
  const current = await getContent();
  const updated = { ...current, [section]: value };
  const { error } = await getSupabaseAdmin().from("site_content").upsert({ id: "main", content: updated, updated_at: new Date().toISOString() });
  throwOnError(error);
}

export async function getMessages(): Promise<Message[]> {
  if (!isSupabaseConfigured()) return [];
  const { data, error } = await getSupabaseAdmin().from("contact_messages")
    .select("id,name,email,topic,message,created_at,is_read")
    .order("created_at", { ascending: false }).limit(1000);
  throwOnError(error);
  return (data ?? []).map((row) => ({ id: row.id, name: row.name, email: row.email, topic: row.topic, message: row.message, date: row.created_at, read: row.is_read }));
}

export async function addMessage(message: Message) {
  const { error } = await getSupabaseAdmin().from("contact_messages").insert({
    id: message.id, name: message.name, email: message.email, topic: message.topic,
    message: message.message, created_at: message.date, is_read: message.read,
  });
  throwOnError(error);
}

export async function setMessageRead(id: string, read: boolean) {
  const { error } = await getSupabaseAdmin().from("contact_messages").update({ is_read: read }).eq("id", id);
  throwOnError(error);
}

export async function deleteMessage(id: string) {
  const { error } = await getSupabaseAdmin().from("contact_messages").delete().eq("id", id);
  throwOnError(error);
}

export async function listUploads() {
  if (!isSupabaseConfigured()) return [];
  const { data, error } = await getSupabaseAdmin().storage.from(uploadBucket).list("", {
    limit: 1000, sortBy: { column: "created_at", order: "desc" },
  });
  throwOnError(error);
  return (data ?? []).filter((item) => item.id && /\.(jpe?g|png|webp|avif|gif)$/i.test(item.name)).map((item) => ({
    name: item.name,
    url: `/uploads/${encodeURIComponent(item.name)}`,
    time: item.created_at ? new Date(item.created_at).getTime() : 0,
  }));
}

export async function uploadImage(name: string, bytes: Buffer, contentType: string) {
  const { error } = await getSupabaseAdmin().storage.from(uploadBucket).upload(name, bytes, {
    contentType, cacheControl: "31536000", upsert: false,
  });
  throwOnError(error);
  return `/uploads/${encodeURIComponent(name)}`;
}

export async function deleteUpload(name: string) {
  const { error } = await getSupabaseAdmin().storage.from(uploadBucket).remove([name]);
  throwOnError(error);
}

export async function downloadUpload(name: string) {
  const { data, error } = await getSupabaseAdmin().storage.from(uploadBucket).download(name);
  if (error) {
    if (error.message.toLowerCase().includes("not found")) return null;
    throw new Error(`Supabase Storage request failed: ${error.message}`);
  }
  return data;
}

export const SUPABASE_UPLOAD_BUCKET = uploadBucket;
