import { cookies } from "next/headers";
import { LOCALE_COOKIE_NAME, locales, defaultLocale, localeDirection, type Locale } from "./config";

export async function getLocaleFromCookies(): Promise<{
  locale: Locale;
  direction: "ltr" | "rtl";
}> {
  const cookieStore = await cookies();
  const localeCookie = cookieStore.get(LOCALE_COOKIE_NAME)?.value;
  const locale: Locale = locales.includes(localeCookie as Locale)
    ? (localeCookie as Locale)
    : defaultLocale;

  return {
    locale,
    direction: localeDirection[locale],
  };
}
