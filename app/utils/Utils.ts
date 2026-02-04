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

  getFileUrl(file?: UploadedFile) {
    if (!file) return;
    if (file.url) return file.url;
    else return `/api/file/${file.data}`;
  },
};
