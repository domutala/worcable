// Detect based on query, cookie, header
export default defineI18nLocaleDetector((event, config) => {
  let locale = config.defaultLocale as string;

  const query = tryQueryLocale(event, { lang: "" }); // disable locale default value with `lang` option
  if (query) locale = query.toString();

  // try to get locale from cookie
  const cookie = tryCookieLocale(event, { lang: "", name: "i18n_locale" }); // disable locale default value with `lang` option
  if (cookie) locale = cookie.toString();

  // try to get locale from header (`accept-header`)
  const header = tryHeaderLocale(event, { lang: "" }); // disable locale default value with `lang` option
  if (header) locale = header.toString();

  locale = locale.split("-")[0] as string;

  return locale;
});
