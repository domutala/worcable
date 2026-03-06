import fs from "node:fs";
import path from "node:path";

export default async function exists(path: string) {
  if (import.meta.dev) return await existsLocale(path);
  return existsSupabase(path);
}

export async function existsLocale(filename: string) {
  const UPLOAD_DIR = path.resolve(process.cwd(), ".data");
  const filePath = path.join(UPLOAD_DIR, filename);
  const exists = fs.existsSync(filePath);

  return exists;
}

export async function existsSupabase(path: string) {
  const { data } = await supabase.storage.from("uploads").exists(path);
  return data;
}
