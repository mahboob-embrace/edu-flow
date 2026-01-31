import React from "react";
import type { Preview, ReactRenderer } from "@storybook/nextjs-vite";
import { withThemeByClassName } from "@storybook/addon-themes";
import "../app/globals.css";

import { ThemeProvider } from "../components/theme/theme-provider";

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
      return (
        <ThemeProvider
          attribute="class"
          defaultTheme={theme}
          enableSystem={false}
          disableTransitionOnChange
        >
          <Story />
        </ThemeProvider>
      );
    },
    // Locale decorator - sets dir attribute for RTL support
    (Story, context) => {
      const locale = context.globals.locale || "en";
      const dir = locale === "ar" ? "rtl" : "ltr";

      React.useEffect(() => {
        document.documentElement.dir = dir;
        document.documentElement.lang = locale;
      }, [dir, locale]);

      return <Story />;
    },
    // Theme by class name decorator (for toolbar toggle)
    withThemeByClassName<ReactRenderer>({
      themes: {
        light: "",
        dark: "dark",
      },
      defaultTheme: "light",
    }),
  ],
};

export default preview;
