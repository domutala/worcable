export async function existsDoc(id: string) {
  return await collections.$Doc.exists({ _id: id });
}
