import _ from "lodash";
import { getDocShema } from "~~/server/shared/doc/schema";

export async function saveDoc({
  $t,
  doc,
}: {
  $t(str: string): string;
  doc: any;
}) {
  const schema = getDocShema({ $t: (str) => str, serverSide: true });
  const _doc = await parseZod(schema, doc);
  const doc_ = await collections.$Doc.create(_doc);

  _.unset(doc_, "data");

  return doc_;
}
