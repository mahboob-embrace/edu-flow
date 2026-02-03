import type { StorybookConfig } from "@storybook/nextjs-vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const config: StorybookConfig = {
  stories: [
    "../components/**/*.mdx",
    "../components/**/*.stories.@(js|jsx|mjs|ts|tsx)",
  ],
  addons: [
    "@storybook/addon-docs",
    "@storybook/addon-vitest",
    "@storybook/addon-a11y",
  ],
  framework: "@storybook/nextjs-vite",
  staticDirs: ["../public"],
  async viteFinal(config) {
    if (config.resolve) {
      config.resolve.alias = {
        ...config.resolve.alias,
        "@": path.resolve(__dirname, "../"),
        // Mock server actions for Storybook
        "@/i18n/actions": path.resolve(__dirname, "../mocks/i18n-actions.ts"),
        // Mock next-auth/react for Storybook
        "next-auth/react": path.resolve(
          __dirname,
          "../mocks/next-auth-react.ts",
        ),
      };
    }
    return config;
  },
};

export default config;
