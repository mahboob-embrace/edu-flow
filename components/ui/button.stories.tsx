import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { Mail } from "lucide-react";

import { Button } from "./button";

const meta = {
  title: "Components/UI/Button",
  component: Button,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: [
        "default",
        "destructive",
        "outline",
        "secondary",
        "ghost",
        "link",
      ],
    },
    size: {
      control: "select",
      options: ["default", "sm", "lg", "icon", "icon-sm", "icon-lg"],
    },
    asChild: {
      control: "boolean",
    },
    disabled: {
      control: "boolean",
    },
  },
  args: {
    onClick: fn(),
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic Variants
export const Default: Story = {
  args: {
    children: "Button",
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button", { name: /button/i });

    // Simulate user clicking the button
    await userEvent.click(button);

    // Assert onClick was called
    await expect(args.onClick).toHaveBeenCalledOnce();
  },
};

export const Destructive: Story = {
  args: {
    variant: "destructive",
    children: "Delete",
  },
};

export const Outline: Story = {
  args: {
    variant: "outline",
    children: "Outline",
  },
};

export const Secondary: Story = {
  args: {
    variant: "secondary",
    children: "Secondary",
  },
};

export const Ghost: Story = {
  args: {
    variant: "ghost",
    children: "Ghost",
  },
};

export const Link: Story = {
  args: {
    variant: "link",
    children: "Link",
  },
};

// Sizes
export const Small: Story = {
  args: {
    size: "sm",
    children: "Small",
  },
};

export const Large: Story = {
  args: {
    size: "lg",
    children: "Large",
  },
};

// With Icons
export const WithIcon: Story = {
  args: {
    children: (
      <>
        <Mail />
        Login with Email
      </>
    ),
  },
};

export const WithIconSmall: Story = {
  args: {
    size: "sm",
    children: (
      <>
        <Mail />
        Login
      </>
    ),
  },
};

export const WithIconLarge: Story = {
  args: {
    size: "lg",
    children: (
      <>
        <Mail />
        Login with Email
      </>
    ),
  },
};

// Icon Only
export const Icon: Story = {
  args: {
    size: "icon",
    children: <Mail />,
  },
};

export const IconSmall: Story = {
  args: {
    size: "icon-sm",
    children: <Mail />,
  },
};

export const IconLarge: Story = {
  args: {
    size: "icon-lg",
    children: <Mail />,
  },
};

// States
export const Disabled: Story = {
  args: {
    disabled: true,
    children: "Disabled",
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button", { name: /disabled/i });

    // Assert button is disabled and onClick was not called
    await expect(button).toBeDisabled();
    await expect(args.onClick).not.toHaveBeenCalled();
  },
};

export const DisabledDestructive: Story = {
  args: {
    variant: "destructive",
    disabled: true,
    children: "Disabled",
  },
};

// Variants Showcase
export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2">
        <Button>Default</Button>
        <Button variant="destructive">Destructive</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="link">Link</Button>
      </div>
      <div className="flex gap-2">
        <Button disabled>Default</Button>
        <Button variant="destructive" disabled>
          Destructive
        </Button>
        <Button variant="outline" disabled>
          Outline
        </Button>
        <Button variant="secondary" disabled>
          Secondary
        </Button>
        <Button variant="ghost" disabled>
          Ghost
        </Button>
        <Button variant="link" disabled>
          Link
        </Button>
      </div>
    </div>
  ),
};

// Sizes Showcase
export const AllSizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Button size="sm">Small</Button>
        <Button>Default</Button>
        <Button size="lg">Large</Button>
      </div>
      <div className="flex items-center gap-2">
        <Button size="icon-sm">
          <Mail />
        </Button>
        <Button size="icon">
          <Mail />
        </Button>
        <Button size="icon-lg">
          <Mail />
        </Button>
      </div>
    </div>
  ),
};
