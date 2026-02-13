import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";

import { Separator } from "./separator";

const meta = {
  title: "Components/UI/Separator",
  component: Separator,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    orientation: {
      control: "select",
      options: ["horizontal", "vertical"],
    },
    decorative: {
      control: "boolean",
    },
  },
} satisfies Meta<typeof Separator>;

export default meta;
type Story = StoryObj<typeof meta>;

// Horizontal Separator
export const Horizontal: Story = {
  render: () => (
    <div className="w-[300px]">
      <div className="space-y-1">
        <h4 className="text-sm font-medium leading-none">Radix Primitives</h4>
        <p className="text-sm text-muted-foreground">
          An open-source UI component library.
        </p>
      </div>
      <Separator className="my-4" />
      <div className="flex h-5 items-center space-x-4 text-sm">
        <div>Blog</div>
        <Separator orientation="vertical" />
        <div>Docs</div>
        <Separator orientation="vertical" />
        <div>Source</div>
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const separators = canvas.getAllByRole("separator");
    await expect(separators).toHaveLength(3);
  },
};

// Vertical Separator
export const Vertical: Story = {
  render: () => (
    <div className="flex h-5 items-center space-x-4 text-sm">
      <div>Blog</div>
      <Separator orientation="vertical" />
      <div>Docs</div>
      <Separator orientation="vertical" />
      <div>Source</div>
    </div>
  ),
};

// In a Menu
export const InMenu: Story = {
  render: () => (
    <div className="w-[200px] rounded-md border p-2">
      <div className="px-2 py-1.5 text-sm font-semibold">My Account</div>
      <Separator className="my-1" />
      <div className="px-2 py-1.5 text-sm">Profile</div>
      <div className="px-2 py-1.5 text-sm">Settings</div>
      <div className="px-2 py-1.5 text-sm">Billing</div>
      <Separator className="my-1" />
      <div className="px-2 py-1.5 text-sm text-destructive">Log out</div>
    </div>
  ),
};

// With Custom Styling
export const CustomStyling: Story = {
  render: () => (
    <div className="w-[300px] space-y-4">
      <div>
        <p className="text-sm text-muted-foreground mb-2">Default</p>
        <Separator />
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-2">Thicker</p>
        <Separator className="h-[2px]" />
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-2">Colored</p>
        <Separator className="bg-primary" />
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-2">
          Dashed (via gradient)
        </p>
        <Separator className="bg-gradient-to-r from-border via-transparent to-border" />
      </div>
    </div>
  ),
};
