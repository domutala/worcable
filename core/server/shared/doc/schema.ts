import * as z from "zod";
import type { Doc } from "~~/server/database/collections";

export function getDocShema({
  $t = (v) => v,
  types,
  maxSize = 10,
  errorTypeMessage,
  errorMaxSizeMessage,
  serverSide = false,
}: {
  $t?: (string: string) => string;
  types?: string[];
  maxSize?: number;
  errorTypeMessage?: string;
  errorMaxSizeMessage?: string;
  serverSide?: boolean;
}) {
  maxSize = maxSize * 1024 * 1024;
  errorTypeMessage ||= $t("uploads.errors.type");
  errorMaxSizeMessage ||= $t("uploads.errors.type");

  const sheama = z
    .custom<Doc>()
    .refine(
      (doc) => (types?.length ? types?.includes(doc?.type) : true),
      errorTypeMessage,
    )
    .refine((doc) => doc?.size <= maxSize, errorMaxSizeMessage)
    .refine(async (doc) => {
      if (serverSide) {
      } else if (import.meta.client) {
      } else if (import.meta.server) {
        const is = await $fetch(`/api/doc/${doc.id}/exists`);
        return is;
      }

      return true;
    }, errorTypeMessage);

  return sheama;
}
