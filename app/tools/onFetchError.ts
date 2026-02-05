export default function onFetchError(error: any) {
  const toast = useToast();
  const { $i18n } = useNuxtApp();

  let data = error.data.data as {
    message?: string;
    messages: { message: string }[];
  };

  data ||= { messages: [] };
  data.messages ||= [];

  if (data.message) data.messages.push({ message: data.message });
  console.log(data.messages);

  toast.add({
    // title: "Success",
    description: h(
      "div",
      { class: "mb-2" },
      data.messages.map((message) => {
        return h("div", {}, $i18n.t(message.message));
      }),
    ),
    color: "error",
  });
}

export function getServerErrorData(error: any) {
  interface IError {
    message?: string;
    messages: { message: string }[];
  }

  const { $i18n } = useNuxtApp();

  let data: IError = error.data?.data || { message: error.statusMessage };
  data.messages ||= [];

  if (data.message) data.messages.push({ message: data.message });
  else data.messages.push({ message: error.statusMessage });

  return {
    statusCode: error.statusCode,
    statusMessage: data.messages[0]?.message,
    messages: data.message,
  };

  // data.messages.map((message) => {
  //   return h("div", {}, $i18n.t(message.message));
  // });
}
