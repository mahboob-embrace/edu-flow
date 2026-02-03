import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, userEvent, within } from "storybook/test";
import { signIn } from "next-auth/react";

import { SocialLoginButtons } from "./social-login-buttons";

const meta = {
  title: "Components/Auth/SocialLoginButtons",
  component: SocialLoginButtons,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  args: {
    disabled: false,
    callbackUrl: "/dashboard",
    testIdPrefix: "social",
  },
} satisfies Meta<typeof SocialLoginButtons>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const googleButton = canvas.getByTestId("google-social");
    const facebookButton = canvas.getByTestId("facebook-social");

    expect(googleButton).toBeDisabled();
    expect(facebookButton).toBeDisabled();
  },
};

export const CustomTestIdPrefix: Story = {
  args: {
    testIdPrefix: "login",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByTestId("google-login")).toBeInTheDocument();
    expect(canvas.getByTestId("facebook-login")).toBeInTheDocument();
  },
};

export const Interaction: Story = {
  args: {
    callbackUrl: "/welcome",
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const googleButton = canvas.getByTestId("google-social");
    const facebookButton = canvas.getByTestId("facebook-social");

    // Click Google button
    await userEvent.click(googleButton);

    // Click Facebook button
    await userEvent.click(facebookButton);

    expect(signIn).toHaveBeenCalledTimes(2);
    expect(signIn).toHaveBeenNthCalledWith(1, "google", {
      callbackUrl: args.callbackUrl,
    });
    expect(signIn).toHaveBeenNthCalledWith(2, "facebook", {
      callbackUrl: args.callbackUrl,
    });
  },
};
