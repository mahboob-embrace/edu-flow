import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, fn, userEvent, within } from "storybook/test";

import { Input } from "./input";
import { Label } from "./label";

const meta = {
  title: "UI/Input",
  component: Input,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    type: {
      control: "select",
      options: ["text", "email", "password", "number", "search", "tel", "url"],
    },
    disabled: {
      control: "boolean",
    },
    placeholder: {
      control: "text",
    },
  },
  args: {
    onChange: fn(),
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic Input
export const Default: Story = {
  args: {
    type: "text",
    placeholder: "Enter text...",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByPlaceholderText("Enter text...");

    // Type into the input
    await userEvent.type(input, "Hello World");
    await expect(input).toHaveValue("Hello World");
  },
};

// Email Input
export const Email: Story = {
  args: {
    type: "email",
    placeholder: "m@example.com",
  },
};

// Password Input
export const Password: Story = {
  args: {
    type: "password",
    placeholder: "Enter password",
  },
};

// Disabled Input
export const Disabled: Story = {
  args: {
    disabled: true,
    placeholder: "Disabled input",
    value: "Cannot edit this",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByPlaceholderText("Disabled input");
    await expect(input).toBeDisabled();
  },
};

// With Label
export const WithLabel: Story = {
  render: () => (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="email">Email</Label>
      <Input type="email" id="email" placeholder="Email" />
    </div>
  ),
};

// File Input
export const File: Story = {
  render: () => (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="picture">Picture</Label>
      <Input id="picture" type="file" />
    </div>
  ),
};

// Search Input
export const Search: Story = {
  args: {
    type: "search",
    placeholder: "Search...",
  },
};

// Number Input
export const Number: Story = {
  args: {
    type: "number",
    placeholder: "0",
  },
};

// All Input Types
export const AllTypes: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-[300px]">
      <div className="space-y-1.5">
        <Label>Text</Label>
        <Input type="text" placeholder="Text input" />
      </div>
      <div className="space-y-1.5">
        <Label>Email</Label>
        <Input type="email" placeholder="Email input" />
      </div>
      <div className="space-y-1.5">
        <Label>Password</Label>
        <Input type="password" placeholder="Password input" />
      </div>
      <div className="space-y-1.5">
        <Label>Number</Label>
        <Input type="number" placeholder="0" />
      </div>
      <div className="space-y-1.5">
        <Label>Disabled</Label>
        <Input disabled placeholder="Disabled" />
      </div>
    </div>
  ),
};
