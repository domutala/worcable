import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import { UploadedFile } from "../interfaces";
import upload from "../supabase/upload";

export default async function saveFile(file: UploadedFile) {
  if (import.meta.dev) return await localeSave(file);
  return await upload(file);
}

async function localeSave(file: UploadedFile) {
  const UPLOAD_DIR = path.resolve(process.cwd(), ".data");
  // créer le dossier si nécessaire
  await mkdir(UPLOAD_DIR, { recursive: true });

  const ext = path.extname(file.filename);
  const baseName = path.basename(file.filename, ext);

  const uniqueName = `${crypto.randomUUID()}${ext}`;
  const filePath = path.join(UPLOAD_DIR, uniqueName);

  await writeFile(filePath, file.data);

  return { ...file, data: uniqueName }; // ou filePath si tu préfères
}
