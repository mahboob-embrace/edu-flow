import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";

import { Label } from "./label";
import { Input } from "./input";
import { Switch } from "./switch";

const meta = {
  title: "UI/Label",
  component: Label,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Label>;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic Label
export const Default: Story = {
  args: {
    children: "Email",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const label = canvas.getByText("Email");
    await expect(label).toBeInTheDocument();
  },
};

// With Input
export const WithInput: Story = {
  render: () => (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="email">Email</Label>
      <Input type="email" id="email" placeholder="m@example.com" />
    </div>
  ),
};

// With Required Indicator
export const Required: Story = {
  render: () => (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="name">
        Name <span className="text-destructive">*</span>
      </Label>
      <Input type="text" id="name" placeholder="Enter your name" />
    </div>
  ),
};

// With Switch
export const WithSwitch: Story = {
  render: () => (
    <div className="flex items-center space-x-2">
      <Switch id="airplane-mode" />
      <Label htmlFor="airplane-mode">Airplane Mode</Label>
    </div>
  ),
};

// Disabled State
export const Disabled: Story = {
  render: () => (
    <div
      className="grid w-full max-w-sm items-center gap-1.5 group"
      data-disabled="true"
    >
      <Label htmlFor="disabled">Disabled Label</Label>
      <Input type="text" id="disabled" placeholder="Disabled input" disabled />
    </div>
  ),
};

// Multiple Labels
export const MultipleFields: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-[300px]">
      <div className="grid gap-1.5">
        <Label htmlFor="first-name">First Name</Label>
        <Input id="first-name" placeholder="John" />
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="last-name">Last Name</Label>
        <Input id="last-name" placeholder="Doe" />
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="email-field">Email</Label>
        <Input id="email-field" type="email" placeholder="john@example.com" />
      </div>
    </div>
  ),
};
