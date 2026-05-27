import { createClient } from "@supabase/supabase-js";
import { config } from "../config";

const supabase = createClient(config.supabase.url, config.supabase.serviceKey);
const BUCKET = "code-snapshots";

export async function saveSnapshot(sessionId: string, code: string, version: number): Promise<string> {
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .upload(`${sessionId}/v${version}.txt`, code, {
      contentType: "text/plain",
      upsert: true,
    });

  if (error) throw error;
  return data.path;
}

export async function getSnapshot(sessionId: string, version: number): Promise<string | null> {
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .download(`${sessionId}/v${version}.txt`);

  if (error) return null;
  return await data.text();
}

export async function listSnapshots(sessionId: string): Promise<number[]> {
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .list(sessionId);

  if (error) return [];
  return data
    .map((f) => parseInt(f.name.replace("v", "").replace(".txt", "")))
    .filter((v) => !isNaN(v))
    .sort((a, b) => b - a);
}

export async function ensureBucket(): Promise<void> {
  const { data: buckets } = await supabase.storage.listBuckets();
  const exists = buckets?.some((b) => b.name === BUCKET);

  if (!exists) {
    await supabase.storage.createBucket(BUCKET, {
      public: false,
      fileSizeLimit: 1024 * 1024, // 1MB
    });
  }
}
