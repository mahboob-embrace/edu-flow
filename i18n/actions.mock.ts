// Mock for i18n/actions server action - used by Storybook
import { defaultLocale, type Locale } from "./config";

export async function setLocale(_locale: Locale): Promise<void> {
  // No-op in Storybook - server actions don't work in browser context
  console.log("[Storybook Mock] setLocale called with:", _locale);
}

export async function getLocale(): Promise<Locale> {
  // Return default locale in Storybook
  return defaultLocale;
}
