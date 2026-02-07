import * as z from "zod";

export default function getFileShema({
  $t = (v) => v,
  types,
  maxSize = 10,
  errorTypeMessage,
  errorMaxSizeMessage,
}: {
  $t?: (string: string) => string;
  types: string[];
  maxSize?: number;
  errorTypeMessage?: string;
  errorMaxSizeMessage?: string;
}) {
  maxSize = maxSize * 1024 * 1024;
  errorTypeMessage ||= $t("uploads.errors.type");
  errorMaxSizeMessage ||= $t("uploads.errors.type");

  const sheama = z
    .any()
    .refine((file) => types.includes(file?.type), errorTypeMessage)
    .refine((file) => file?.size <= maxSize, errorMaxSizeMessage)
    .refine(async (file) => {
      if (import.meta.server) {
        const is = await $fetch(`/api/file/${file.data}/exists`);
        return is;
      }

      return true;
    }, errorTypeMessage);
  // .transform((v) => {
  //   return v as UpFile;
  // });

  return sheama;
}
