export const locales = ["en", "da", "ar"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export const localeNames: Record<Locale, string> = {
  en: "English",
  da: "Dansk",
  ar: "العربية",
};

export const localeDirection: Record<Locale, "ltr" | "rtl"> = {
  en: "ltr",
  da: "ltr",
  ar: "rtl",
};

export const LOCALE_COOKIE_NAME = "NEXT_LOCALE";
