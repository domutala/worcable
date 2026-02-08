import onFetchError from "~/tools/onFetchError";
import type { UploadedFile } from "~~/server/interfaces";

export default {
  getDateStatus: (inputDate: string | Date) => {
    const dayjs = useDayjs();
    const date = dayjs(inputDate);
    const now = dayjs();

    const status = {
      isHour:
        date.isAfter(now.subtract(1, "hour")) &&
        date.isBefore(now.add(1, "hour")),

      isToday: date.isToday(),
      isYesterday: date.isYesterday(),
      isTomorow: date.isTomorrow(),

      isSameWeek: date.isSame(now, "week"),
      isMonth: date.isSame(now, "month"),

      daysFromNow: now.diff(date, "d"),
    };

    if (status.daysFromNow <= 20) return dayjs(date).fromNow();
    return dayjs(date).format("DD MMM YYYY HH:mm");
  },

  fileSizeFormat(size: number, si = false, dp = 1) {
    var i = size == 0 ? 0 : Math.floor(Math.log(size) / Math.log(1024));
    return (
      +(size / Math.pow(1024, i)).toFixed(2) * 1 +
      " " +
      ["B", "kB", "MB", "GB", "TB"][i]
    );
  },

  getFileUrl(file?: UploadedFile | null) {
    if (!file) return;
    if (file.url) return file.url;
    else return `/api/file/${file.data}`;
  },

  /**
   * Formate un nombre en fonction du code de devise (ISO 4217).
   * @param amount - Le montant à formater
   * @param currencyCode - Le code (ex: 'EUR', 'XOF', 'USD')
   * @param locale - Optionnel : la locale (par défaut celle du navigateur)
   */
  formatCurrency: (
    amount: number,
    currencyCode: string,
    {
      locale = "fr",
      style = "decimal",
    }: { locale?: string; style?: Intl.NumberFormatOptionsStyle } = {},
  ): string => {
    try {
      return new Intl.NumberFormat(locale, {
        style,
        currency: currencyCode,
        // Optionnel : masquer les centimes pour les grosses monnaies comme le XOF
        minimumFractionDigits: ["XOF", "XAF", "JPY", "KRW"].includes(
          currencyCode,
        )
          ? 0
          : 2,
        maximumFractionDigits: ["XOF", "XAF", "JPY", "KRW"].includes(
          currencyCode,
        )
          ? 0
          : 2,
      }).format(amount);
    } catch (error) {
      // Repli sécurisé si le code de devise est invalide
      return `${amount}`;
    }
  },

  async uploadFile(file: File) {
    try {
      const runtime = useRuntimeConfig();
      const formData = new FormData();
      formData.append("file", file);
      const result = await $fetch("/api/upload", {
        method: "post",
        body: formData,
        headers: { "x-uploads-key": runtime.uploadsKey },
      });
      return result;
    } catch (error) {
      onFetchError(error);
    }
  },
  createObjectUrl(file?: File) {
    if (!file) return;
    return URL.createObjectURL(file);
  },
};
