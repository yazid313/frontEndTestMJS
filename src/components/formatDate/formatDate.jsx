export const FormatDate = (date) => {
  if (!date) return "-";

  const parsedDate = new Date(date);
  if (isNaN(parsedDate)) return "-";

  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Jakarta",
  }).format(parsedDate);
};
