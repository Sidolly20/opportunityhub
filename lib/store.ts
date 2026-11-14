import { promises as fs } from "fs";
import path from "path";
import { createClient } from "@supabase/supabase-js";
import type { Opportunity } from "./types";

const LOCAL_FILE = path.join(process.cwd(), "data", "opportunities.json");

function supabase() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}

/**
 * Supabase table (run once in the Supabase SQL Editor):
 *
 * create table if not exists opportunities (
 *   id text primary key,
 *   slug text unique not null,
 *   data jsonb not null,
 *   published_at timestamptz not null
 * );
 */

export async function getAll(): Promise<Opportunity[]> {
  const sb = supabase();
  if (sb) {
    const { data, error } = await sb
      .from("opportunities")
      .select("data")
      .order("published_at", { ascending: false })
      .limit(1000);
    if (error) throw new Error(`Supabase read failed: ${error.message}`);
    return (data ?? []).map((r) => r.data as Opportunity);
  }
  try {
    const raw = await fs.readFile(LOCAL_FILE, "utf8");
    return JSON.parse(raw) as Opportunity[];
  } catch {
    return [];
  }
}

export async function getBySlug(slug: string): Promise<Opportunity | null> {
  const all = await getAll();
  return all.find((o) => o.slug === slug) ?? null;
}

export async function saveMany(items: Opportunity[]): Promise<void> {
  if (items.length === 0) return;
  const sb = supabase();
  if (sb) {
    const rows = items.map((o) => ({
      id: o.id,
      slug: o.slug,
      data: o,
      published_at: o.publishedAt,
    }));
    const { error } = await sb.from("opportunities").upsert(rows, { onConflict: "id" });
    if (error) throw new Error(`Supabase write failed: ${error.message}`);
    return;
  }
  const existing = await getAll();
  const byId = new Map(existing.map((o) => [o.id, o]));
  for (const o of items) byId.set(o.id, o);
  const merged = [...byId.values()].sort(
    (a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt)
  );
  await fs.mkdir(path.dirname(LOCAL_FILE), { recursive: true });
  await fs.writeFile(LOCAL_FILE, JSON.stringify(merged, null, 2), "utf8");
}
