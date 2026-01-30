import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SignInPage from "./page";
import { signIn } from "next-auth/react";

// Mock next-auth/react
jest.mock("next-auth/react", () => ({
  signIn: jest.fn(),
  useSession: jest.fn(() => ({ data: null, status: "unauthenticated" })),
}));

// Mock next-intl
jest.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));

// Mock next/link
jest.mock("next/link", () => {
  const MockLink = ({
    children,
    href,
    ...props
  }: {
    children: React.ReactNode;
    href: string;
    [key: string]: unknown;
  }) => {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    );
  };
  MockLink.displayName = "MockLink";
  return MockLink;
});

// Mock navigation utility
const mockHardNavigate = jest.fn();
jest.mock("@/lib/navigation", () => ({
  hardNavigate: (url: string) => mockHardNavigate(url),
}));
describe("SignInPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("renders correctly", () => {
    render(<SignInPage />);
    expect(screen.getByTestId("signin-card")).toBeInTheDocument();
    expect(screen.getByTestId("google-signin")).toBeInTheDocument();
    expect(screen.getByTestId("facebook-signin")).toBeInTheDocument();
    expect(screen.getByTestId("email-input")).toBeInTheDocument();
    expect(screen.getByTestId("password-input")).toBeInTheDocument();
    expect(screen.getByTestId("signin-submit")).toBeInTheDocument();
  });

  it("calls social signIn when social buttons are clicked", async () => {
    const user = userEvent.setup();
    render(<SignInPage />);

    await user.click(screen.getByTestId("google-signin"));
    expect(signIn).toHaveBeenCalledWith("google", {
      callbackUrl: "/dashboard",
    });

    await user.click(screen.getByTestId("facebook-signin"));
    expect(signIn).toHaveBeenCalledWith("facebook", {
      callbackUrl: "/dashboard",
    });
  });

  it("handles successful sign in", async () => {
    const user = userEvent.setup();
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ user: { email: "test@example.com" } }),
    });

    render(<SignInPage />);

    await user.type(screen.getByTestId("email-input"), "test@example.com");
    await user.type(screen.getByTestId("password-input"), "password123");
    await user.click(screen.getByTestId("signin-submit"));

    // Wait for fetch to be called
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        "/api/auth/signin",
        expect.objectContaining({
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: "test@example.com",
            password: "password123",
          }),
        }),
      );
    });

    // Wait for redirect via hardNavigate
    await waitFor(() => {
      expect(mockHardNavigate).toHaveBeenCalledWith("/dashboard");
    });
  });

  it("handles invalid credentials error", async () => {
    const user = userEvent.setup();
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: "Invalid email or password" }),
    });

    render(<SignInPage />);

    await user.type(screen.getByTestId("email-input"), "test@example.com");
    await user.type(screen.getByTestId("password-input"), "wrong");
    await user.click(screen.getByTestId("signin-submit"));

    await waitFor(() => {
      expect(screen.getByTestId("signin-error")).toHaveTextContent(
        "Invalid email or password",
      );
    });
  });

  it("handles lockout error", async () => {
    const user = userEvent.setup();
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 423,
      json: async () => ({
        error: "Account temporarily locked. Try again in 15 minutes.",
      }),
    });

    render(<SignInPage />);

    await user.type(screen.getByTestId("email-input"), "test@example.com");
    await user.type(screen.getByTestId("password-input"), "password");
    await user.click(screen.getByTestId("signin-submit"));

    await waitFor(() => {
      expect(screen.getByTestId("signin-error")).toHaveTextContent(
        "Account temporarily locked. Try again in 15 minutes.",
      );
    });
  });

  it("handles rate limit error", async () => {
    const user = userEvent.setup();
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 429,
      json: async () => ({
        error: "Too many login attempts. Please try again later.",
      }),
    });

    render(<SignInPage />);

    await user.type(screen.getByTestId("email-input"), "test@example.com");
    await user.type(screen.getByTestId("password-input"), "password");
    await user.click(screen.getByTestId("signin-submit"));

    await waitFor(() => {
      expect(screen.getByTestId("signin-error")).toHaveTextContent(
        "Too many login attempts. Please try again later.",
      );
    });
  });

  it("shows loading state during submission", async () => {
    const user = userEvent.setup();
    let resolveFetch: (
      value: Response | PromiseLike<Response>,
    ) => void = () => {};
    const fetchPromise = new Promise<Response>((resolve) => {
      resolveFetch = resolve;
    });
    (global.fetch as jest.Mock).mockReturnValue(fetchPromise);

    render(<SignInPage />);

    await user.type(screen.getByTestId("email-input"), "test@example.com");
    await user.type(screen.getByTestId("password-input"), "password");
    await user.click(screen.getByTestId("signin-submit"));

    expect(screen.getByTestId("signin-submit")).toBeDisabled();
    expect(screen.getByTestId("signin-submit")).toHaveTextContent("signingIn");
    expect(screen.getByTestId("email-input")).toBeDisabled();
    expect(screen.getByTestId("password-input")).toBeDisabled();

    resolveFetch({
      ok: true,
      json: async () => ({ user: {} }),
    } as unknown as Response);

    // Wait for redirect via hardNavigate
    await waitFor(() => {
      expect(mockHardNavigate).toHaveBeenCalledWith("/dashboard");
    });
  });

  it("handles generic network error", async () => {
    const user = userEvent.setup();
    (global.fetch as jest.Mock).mockRejectedValueOnce(
      new Error("Network connection lost"),
    );

    render(<SignInPage />);

    await user.type(screen.getByTestId("email-input"), "test@example.com");
    await user.type(screen.getByTestId("password-input"), "password");
    await user.click(screen.getByTestId("signin-submit"));

    await waitFor(() => {
      expect(screen.getByTestId("signin-error")).toHaveTextContent(
        "somethingWentWrong",
      );
    });
  });
});
