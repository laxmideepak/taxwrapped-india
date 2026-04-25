export type Locale = "en" | "hi";

export function formatINR(amount: number, locale: Locale): string {
  const numberLocale = locale === "hi" ? "en-IN" : "en-IN";
  return new Intl.NumberFormat(numberLocale, {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Math.round(amount));
}

export function formatPercent(value: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "percent",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 1,
  }).format(value);
}
