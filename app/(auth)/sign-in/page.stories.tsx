import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, userEvent, within, waitFor } from "storybook/test";
import { http, HttpResponse, delay } from "msw";

import SignInPage from "./page";
import { hardNavigate } from "@/lib/navigation";

/**
 * Helper to fill and submit the sign-in form
 */
const fillAndSubmit = async (
  canvas: ReturnType<typeof within>,
  { email, password }: { email: string; password: string },
) => {
  await userEvent.type(canvas.getByLabelText(/email/i), email);
  await userEvent.type(canvas.getByLabelText(/password/i), password);
  await userEvent.click(canvas.getByRole("button", { name: /sign in/i }));
};

const meta = {
  title: "Pages/Auth/SignIn",
  component: SignInPage,
  parameters: {
    layout: "centered",
    nextjs: {
      appDirectory: true,
    },
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div style={{ width: "400px", maxWidth: "100%" }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof SignInPage>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default sign-in page with all interactive elements
 */
export const Default: Story = {};

/**
 * Shows the loading state when form is being submitted
 */
export const Loading: Story = {
  parameters: {
    msw: {
      handlers: [
        http.post("/api/auth/signin", async () => {
          // Simulate a slow network request
          await delay("infinite");
          return HttpResponse.json({ user: {} });
        }),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Fill and submit the form
    await fillAndSubmit(canvas, {
      email: "test@example.com",
      password: "password123",
    });

    // Check loading state
    await waitFor(() => {
      expect(canvas.getByRole("button", { name: /sign in/i })).toBeDisabled();
    });
  },
};

/**
 * Shows validation error when credentials are invalid
 */
export const InvalidCredentials: Story = {
  parameters: {
    msw: {
      handlers: [
        http.post("/api/auth/signin", () => {
          return HttpResponse.json(
            { error: "Invalid email or password" },
            { status: 401 },
          );
        }),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Fill and submit the form with invalid credentials
    await fillAndSubmit(canvas, {
      email: "wrong@example.com",
      password: "wrongpassword",
    });

    // Verify error message is displayed
    await waitFor(() => {
      expect(
        canvas.getByText(/invalid email or password/i),
      ).toBeInTheDocument();
    });
  },
};

/**
 * Shows rate limiting error when too many attempts
 */
export const RateLimited: Story = {
  parameters: {
    msw: {
      handlers: [
        http.post("/api/auth/signin", () => {
          return HttpResponse.json(
            { error: "Too many login attempts. Please try again later." },
            { status: 429 },
          );
        }),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Fill and submit the form
    await fillAndSubmit(canvas, {
      email: "test@example.com",
      password: "password123",
    });

    // Verify error message is displayed
    await waitFor(() => {
      expect(canvas.getByText(/too many login attempts/i)).toBeInTheDocument();
    });
  },
};

/**
 * Shows account locked error
 */
export const AccountLocked: Story = {
  parameters: {
    msw: {
      handlers: [
        http.post("/api/auth/signin", () => {
          return HttpResponse.json(
            { error: "Account temporarily locked. Try again in 15 minutes." },
            { status: 423 },
          );
        }),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Fill and submit the form
    await fillAndSubmit(canvas, {
      email: "locked@example.com",
      password: "password123",
    });

    // Verify error message is displayed
    await waitFor(() => {
      expect(
        canvas.getByText(/account temporarily locked/i),
      ).toBeInTheDocument();
    });
  },
};

/**
 * Successful login flow - verifies form submission and navigation
 */
export const SuccessfulLogin: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Fill and submit the form with valid credentials
    await fillAndSubmit(canvas, {
      email: "success@example.com",
      password: "validpassword",
    });

    // Verify navigation was called (mocked)
    await waitFor(() => {
      expect(hardNavigate).toHaveBeenCalledWith("/dashboard");
    });
  },
};

/**
 * Tests the link to sign-up page
 */
export const HasSignUpLink: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Find the sign-up link
    const signUpLink = canvas.getByRole("link", { name: /sign up/i });
    expect(signUpLink).toBeInTheDocument();
    expect(signUpLink).toHaveAttribute("href", "/sign-up");
  },
};
