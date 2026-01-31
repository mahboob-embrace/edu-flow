import React, { useEffect } from "react";
import type { Preview } from "@storybook/nextjs-vite";
import { useTheme } from "next-themes";
import "../app/globals.css";

import { ThemeProvider } from "../components/theme/theme-provider";
import {
  ColorThemeProvider,
  useColorTheme,
  colorThemes,
  ColorTheme,
} from "../components/theme/color-theme-provider";
import {
  locales,
  localeNames,
  localeDirection,
  type Locale,
} from "../i18n/config";

// Helper to sync Storybook global theme with next-themes
const ThemeSync = ({ theme }: { theme: string }) => {
  const { setTheme } = useTheme();
  useEffect(() => {
    setTheme(theme);
  }, [theme, setTheme]);
  return null;
};

// Helper to sync Storybook global color theme with ColorThemeProvider
const ColorThemeSync = ({ theme }: { theme: ColorTheme }) => {
  const { setColorTheme } = useColorTheme();
  useEffect(() => {
    setColorTheme(theme);
  }, [theme, setColorTheme]);
  return null;
};

// Helper to sync Storybook global locale with document attributes
const LocaleSync = ({ locale }: { locale: Locale }) => {
  useEffect(() => {
    const dir = localeDirection[locale];
    document.documentElement.dir = dir;
    document.documentElement.lang = locale;
  }, [locale]);
  return null;
};

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: "todo",
    },
  },
  globalTypes: {
    theme: {
      name: "Theme",
      description: "Global theme for components",
      defaultValue: "light",
      toolbar: {
        icon: "circlehollow",
        items: [
          { value: "light", icon: "circlehollow", title: "light" },
          { value: "dark", icon: "circle", title: "dark" },
        ],
      },
    },
    colorTheme: {
      name: "Color Theme",
      description: "Global color theme for components",
      defaultValue: "default",
      toolbar: {
        icon: "paintbrush",
        items: colorThemes.map((t) => ({
          value: t.value,
          title: t.name,
          right: t.value === "default" ? "" : t.value,
        })),
      },
    },
    locale: {
      name: "Locale",
      description: "Internationalization locale",
      defaultValue: "en",
      toolbar: {
        icon: "globe",
        items: locales.map((locale) => ({
          value: locale,
          title: localeNames[locale],
          right: localeDirection[locale].toUpperCase(),
        })),
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    // Unified decorator for setting up global context (Theme, Color Theme, and Locale)
    (Story, context) => {
      const theme = context.globals.theme || "light";
      const colorTheme = context.globals.colorTheme || "default";
      const locale = (context.globals.locale || "en") as Locale;

      return (
        <ThemeProvider
          attribute="class"
          defaultTheme={theme}
          enableSystem={false}
          disableTransitionOnChange
        >
          <ColorThemeProvider defaultTheme={colorTheme}>
            <ThemeSync theme={theme} />
            <ColorThemeSync theme={colorTheme} />
            <LocaleSync locale={locale} />
            <Story />
          </ColorThemeProvider>
        </ThemeProvider>
      );
    },
  ],
};

export default preview;
