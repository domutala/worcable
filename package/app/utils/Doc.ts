export default {
  async upload(file: File) {
    try {
      const runtime = useRuntimeConfig();
      const formData = new FormData();
      formData.append("file", file);
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

  async uploadBeforeSubmit(data: Record<string, any>) {
    for (const key of Object.keys(data)) {
      if (data[key] instanceof File) data[key] = await this.upload(data[key]);
    }

    return data;
  },

  createObjectUrl(file?: File) {
    if (!file) return;
    return URL.createObjectURL(file);
  },
};
