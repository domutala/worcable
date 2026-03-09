function useFetch() {
  const fetch = $fetch.create({
    onResponseError(e) {
      OnFetchError(e.response);
    },
  });

  return fetch;
}

export default {
  $fetch: useFetch(),
};
