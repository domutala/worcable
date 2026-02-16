import * as z from "zod";

export function getApplyCommentSchema($t: (string: string) => string) {
  const comment = z.string($t("apply_comment.items.errors.invalid_type"));
  const schema = z.object({ comment });

  return { comment, schema };
}
