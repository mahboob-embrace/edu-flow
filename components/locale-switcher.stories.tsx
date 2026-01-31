import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, userEvent, within } from "storybook/test";

import { LocaleSwitcher } from "./locale-switcher";
import { locales, localeNames } from "@/i18n/config";

const meta = {
  title: "Components/LocaleSwitcher",
  component: LocaleSwitcher,
  parameters: {
    layout: "centered",
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: "/",
      },
    },
  },
  tags: ["autodocs"],
  args: {
    currentLocale: "en",
  },
  argTypes: {
    currentLocale: {
      control: "select",
      options: locales,
      description: "The currently active locale",
    },
  },
} satisfies Meta<typeof LocaleSwitcher>;

export default meta;
type Story = StoryObj<typeof meta>;

// Default state with English selected
export const Default: Story = {
  args: {
    currentLocale: "en",
  },
};

// Danish locale selected
export const Danish: Story = {
  args: {
    currentLocale: "da",
  },
};

// Arabic locale selected (RTL)
export const Arabic: Story = {
  args: {
    currentLocale: "ar",
  },
};

// Open state showing all locale options
export const OpenMenu: Story = {
  args: {
    currentLocale: "en",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByTestId("locale-switcher-trigger");

    // Open the dropdown
    await userEvent.click(trigger);

    // Verify all locale options are visible
    for (const locale of locales) {
      await within(document.body).findByTestId(`locale-option-${locale}`);
    }

    const englishOption = await within(document.body).findByTestId(
      "locale-option-en",
    );

    // Verify current locale is highlighted
    await expect(englishOption).toHaveClass("bg-accent");
  },
};

// All locales showcase
export const AllLocales: Story = {
  render: () => (
    <div className="flex gap-4">
      {locales.map((locale) => (
        <div key={locale} className="flex flex-col items-center gap-2">
          <span className="text-sm text-muted-foreground">
            {localeNames[locale]}
          </span>
          <LocaleSwitcher currentLocale={locale} />
        </div>
      ))}
    </div>
  ),
};
