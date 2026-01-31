import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, fn, userEvent, within } from "storybook/test";

import { Switch } from "./switch";
import { Label } from "./label";

const meta = {
  title: "UI/Switch",
  component: Switch,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    disabled: {
      control: "boolean",
    },
    checked: {
      control: "boolean",
    },
  },
  args: {
    onCheckedChange: fn(),
  },
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

// Default Switch
export const Default: Story = {
  args: {},
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const switchEl = canvas.getByRole("switch");

    // Toggle the switch
    await userEvent.click(switchEl);
    await expect(args.onCheckedChange).toHaveBeenCalledWith(true);
  },
};

// Checked State
export const Checked: Story = {
  args: {
    defaultChecked: true,
  },
};

// Disabled States
export const Disabled: Story = {
  args: {
    disabled: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const switchEl = canvas.getByRole("switch");
    await expect(switchEl).toBeDisabled();
  },
};

export const DisabledChecked: Story = {
  args: {
    disabled: true,
    defaultChecked: true,
  },
};

// With Label
export const WithLabel: Story = {
  render: () => (
    <div className="flex items-center space-x-2">
      <Switch id="airplane-mode" />
      <Label htmlFor="airplane-mode">Airplane Mode</Label>
    </div>
  ),
};

// Form Example
export const FormExample: Story = {
  render: () => (
    <div className="space-y-4 w-[300px]">
      <div className="flex items-center justify-between rounded-lg border p-4">
        <div className="space-y-0.5">
          <Label className="text-base">Marketing emails</Label>
          <p className="text-sm text-muted-foreground">
            Receive emails about new products, features, and more.
          </p>
        </div>
        <Switch />
      </div>
      <div className="flex items-center justify-between rounded-lg border p-4">
        <div className="space-y-0.5">
          <Label className="text-base">Security emails</Label>
          <p className="text-sm text-muted-foreground">
            Receive emails about your account security.
          </p>
        </div>
        <Switch defaultChecked />
      </div>
      <div className="flex items-center justify-between rounded-lg border p-4">
        <div className="space-y-0.5">
          <Label className="text-base text-muted-foreground">
            Disabled option
          </Label>
          <p className="text-sm text-muted-foreground">
            This option is currently unavailable.
          </p>
        </div>
        <Switch disabled />
      </div>
    </div>
  ),
};

// All States
export const AllStates: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex items-center space-x-2">
        <Switch />
        <Label>Unchecked</Label>
      </div>
      <div className="flex items-center space-x-2">
        <Switch defaultChecked />
        <Label>Checked</Label>
      </div>
      <div className="flex items-center space-x-2">
        <Switch disabled />
        <Label className="text-muted-foreground">Disabled Unchecked</Label>
      </div>
      <div className="flex items-center space-x-2">
        <Switch disabled defaultChecked />
        <Label className="text-muted-foreground">Disabled Checked</Label>
      </div>
    </div>
  ),
};
