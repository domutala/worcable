import { existsSync, statSync } from "node:fs";
import path from "node:path";
import * as fileType from "file-type";

export function getFile(filename: string) {
  return localGet(filename);
}

async function localGet(filename: string) {
  const UPLOAD_DIR = path.resolve(process.cwd(), ".data");
  const filePath = path.join(UPLOAD_DIR, filename);
  const exists = existsSync(filePath);
  let mimeType;
  let size;

  if (exists) {
    const e = await fileType.fileTypeFromFile(filePath);
    mimeType = e?.mime;

    const stats = statSync(filePath);
    size = stats.size;
  }

  return { filePath, exists, mimeType, size };
}
