import path from "node:path";
import { UploadedFile } from "../interfaces";

export default async function upload(file: UploadedFile) {
  const ext = path.extname(file.filename);
  const baseName = path.basename(file.filename, ext);
  const uniqueName = `${crypto.randomUUID()}${ext}`;

  const result = await supabase.storage
    .from("uploads")
    .upload(uniqueName, file.data, { contentType: file.type });

  if (result.error) {
    throw "";
  }

  const { data } = supabase.storage
    .from("uploads")
    .getPublicUrl(result.data.path);

  return {
    ...file,
    url: data.publicUrl,
    data: result.data.path,
    id: result.data.id,
  };
}
