export function formatDate(date: Date | string | number) {
  if (!date) return "";
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "long",
  }).format(new Date(date));
}
