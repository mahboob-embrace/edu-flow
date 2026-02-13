import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, userEvent, within, waitFor } from "storybook/test";

import { ThemeSwitcher } from "./theme-switcher";
import { colorThemes } from "./color-theme-provider";

const meta = {
  title: "Components/Theme/ThemeSwitcher",
  component: ThemeSwitcher,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof ThemeSwitcher>;

export default meta;
type Story = StoryObj<typeof meta>;

// Default state
export const Default: Story = {};

// Open menu showing all options
export const OpenMenu: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole("button", { name: /toggle theme/i });

    // Open the dropdown
    await userEvent.click(trigger);

    // Verify Mode section is visible
    const menu = await within(document.body).findByRole("menu");
    await expect(menu).toBeInTheDocument();

    // Verify mode options are visible
    await within(document.body).findByRole("menuitem", { name: /light/i });
    await within(document.body).findByRole("menuitem", { name: /dark/i });
    await within(document.body).findByRole("menuitem", { name: /system/i });

    // Verify all color theme options are visible
    for (const ct of colorThemes) {
      await within(document.body).findByRole("menuitem", { name: ct.name });
    }
  },
};

// Test mode selection
export const SelectLightMode: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole("button", { name: /toggle theme/i });

    await userEvent.click(trigger);

    const lightOption = await within(document.body).findByRole("menuitem", {
      name: /light/i,
    });
    await userEvent.click(lightOption);

    // Wait for menu to fully close
    await waitFor(() => {
      expect(within(document.body).queryByRole("menu")).not.toBeInTheDocument();
    });

    // Re-open menu to verify selection
    await userEvent.click(trigger);

    // Wait for the theme to update and the check icon to be visible
    await waitFor(async () => {
      const lightOptionAfter = await within(document.body).findByRole(
        "menuitem",
        { name: /light/i },
      );
      const icons = lightOptionAfter.querySelectorAll("svg");
      expect(icons.length).toBeGreaterThan(1);
    });
  },
};

// Test dark mode selection
export const SelectDarkMode: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole("button", { name: /toggle theme/i });

    await userEvent.click(trigger);

    const darkOption = await within(document.body).findByRole("menuitem", {
      name: /dark/i,
    });
    await userEvent.click(darkOption);

    // Wait for menu to fully close
    await waitFor(() => {
      expect(within(document.body).queryByRole("menu")).not.toBeInTheDocument();
    });

    // Re-open menu to verify selection
    await userEvent.click(trigger);

    // Wait for the theme to update and the check icon to be visible
    await waitFor(async () => {
      const darkOptionAfter = await within(document.body).findByRole(
        "menuitem",
        { name: /dark/i },
      );
      const icons = darkOptionAfter.querySelectorAll("svg");
      expect(icons.length).toBeGreaterThan(1);
    });
  },
};

// Test color theme selection
export const SelectColorTheme: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole("button", { name: /toggle theme/i });

    await userEvent.click(trigger);

    // Select amber color theme
    const amberOption = await within(document.body).findByRole("menuitem", {
      name: /amber/i,
    });
    await userEvent.click(amberOption);

    // Verify the data-theme attribute is set
    await waitFor(() => {
      expect(document.documentElement.getAttribute("data-theme")).toBe("amber");
    });
  },
};

// Tests keyboard accessibility
export const KeyboardAccessibility: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole("button", { name: /toggle theme/i });

    // Focus the trigger
    trigger.focus();
    await expect(trigger).toHaveFocus();

    // Open dropdown with Enter key
    await userEvent.keyboard("{Enter}");

    // Verify menu is open
    const menu = await within(document.body).findByRole("menu");
    await expect(menu).toBeInTheDocument();

    // Close dropdown with Escape key
    await userEvent.keyboard("{Escape}");

    // Wait for the menu to close. Radix DropdownMenuContent is either unmounted
    // or has its `data-state` attribute set to "closed" after the animation.
    await waitFor(() => {
      const menuAfter = within(document.body).queryByRole("menu");
      if (menuAfter) {
        expect(menuAfter.getAttribute("data-state")).toBe("closed");
      } else {
        expect(menuAfter).not.toBeInTheDocument();
      }
    });
  },
};

// Test all color themes are displayed with correct styling
export const ColorThemeOptions: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole("button", { name: /toggle theme/i });

    await userEvent.click(trigger);

    // Verify all color themes have color preview circles
    for (const ct of colorThemes) {
      const option = await within(document.body).findByRole("menuitem", {
        name: ct.name,
      });
      const colorCircle = option.querySelector('span[class*="rounded-full"]');
      await expect(colorCircle).not.toBeNull();
    }
  },
};
