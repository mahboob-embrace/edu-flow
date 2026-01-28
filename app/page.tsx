import { getLocale } from "next-intl/server";
import { HomeContent } from "./home-content";
import { type Locale } from "@/i18n/config";

export default async function Home() {
  const locale = (await getLocale()) as Locale;

  return <HomeContent locale={locale} />;
}
