import type { Doc } from "~~/server/database/collections";

export default {
  async upload(doc: File) {
    try {
      const runtime = useRuntimeConfig();
      const formData = new FormData();
      formData.append("doc", doc);
      const result = await Api.$fetch("/api/doc/upload", {
        method: "post",
        body: formData,
        headers: { "x-uploads-key": runtime.uploadsKey },
      });
      return result;
    } catch (error) {
      console.log(error);
    }
  },

  async uploadBeforeSubmit<T extends Record<string, any>>(data: T) {
    for (const key of Object.keys(data)) {
      if (data[key] instanceof File) {
        data = _.set(data, key, await this.upload(data[key]));
      }
    }

    return data as T;
  },

  getUrl(doc?: File | Doc) {
    return this.createObjectUrl(doc);
  },

  createObjectUrl(doc?: File | Doc) {
    if (!doc) return;
    return doc instanceof File
      ? URL.createObjectURL(doc)
      : doc.url || `/api/doc/${doc.id}`;
  },
};
