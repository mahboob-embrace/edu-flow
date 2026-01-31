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
        items: [
          { value: "en", title: "English", right: "LTR" },
          { value: "da", title: "Dansk", right: "LTR" },
          { value: "ar", title: "العربية", right: "RTL" },
        ],
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    // Theme decorator using next-themes
    (Story, context) => {
      const theme = context.globals.theme || "light";
      const colorTheme = context.globals.colorTheme || "default";
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
            <Story />
          </ColorThemeProvider>
        </ThemeProvider>
      );
    },
    // Locale decorator - sets dir attribute for RTL support
    (Story, context) => {
      const locale = context.globals.locale || "en";
      const dir = locale === "ar" ? "rtl" : "ltr";

      useEffect(() => {
        document.documentElement.dir = dir;
        document.documentElement.lang = locale;
      }, [dir, locale]);

      return <Story />;
    },
  ],
};

export default preview;
