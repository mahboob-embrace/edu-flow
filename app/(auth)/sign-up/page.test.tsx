import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SignUpPage from "./page";
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

// Mock next/navigation
const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
    replace: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
    prefetch: jest.fn(),
  }),
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

describe("SignUpPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("Rendering", () => {
    it("renders all form elements correctly", () => {
      render(<SignUpPage />);

      expect(screen.getByTestId("signup-card")).toBeInTheDocument();
      expect(screen.getByTestId("google-signup")).toBeInTheDocument();
      expect(screen.getByTestId("facebook-signup")).toBeInTheDocument();
      expect(screen.getByTestId("name-input")).toBeInTheDocument();
      expect(screen.getByTestId("email-input")).toBeInTheDocument();
      expect(screen.getByTestId("password-input")).toBeInTheDocument();
      expect(screen.getByTestId("confirm-password-input")).toBeInTheDocument();
      expect(screen.getByTestId("signup-submit")).toBeInTheDocument();
      expect(screen.getByTestId("signin-link")).toBeInTheDocument();
    });

    it("renders sign-in link with correct href", () => {
      render(<SignUpPage />);

      const signInLink = screen.getByTestId("signin-link");
      expect(signInLink).toHaveAttribute("href", "/sign-in");
    });

    it("does not show error message initially", () => {
      render(<SignUpPage />);

      expect(screen.queryByTestId("signup-error")).not.toBeInTheDocument();
    });
  });

  describe("Social Sign-Up", () => {
    it("calls Google signIn when Google button is clicked", async () => {
      const user = userEvent.setup();
      render(<SignUpPage />);

      await user.click(screen.getByTestId("google-signup"));

      expect(signIn).toHaveBeenCalledWith("google", {
        callbackUrl: "/dashboard",
      });
    });

    it("calls Facebook signIn when Facebook button is clicked", async () => {
      const user = userEvent.setup();
      render(<SignUpPage />);

      await user.click(screen.getByTestId("facebook-signup"));

      expect(signIn).toHaveBeenCalledWith("facebook", {
        callbackUrl: "/dashboard",
      });
    });

    it("disables social buttons during form submission", async () => {
      const user = userEvent.setup();
      let resolveFetch: (
        value: Response | PromiseLike<Response>,
      ) => void = () => {};
      const fetchPromise = new Promise<Response>((resolve) => {
        resolveFetch = resolve;
      });
      (global.fetch as jest.Mock).mockReturnValue(fetchPromise);

      render(<SignUpPage />);

      await user.type(screen.getByTestId("name-input"), "Test User");
      await user.type(screen.getByTestId("email-input"), "test@example.com");
      await user.type(screen.getByTestId("password-input"), "password123");
      await user.type(
        screen.getByTestId("confirm-password-input"),
        "password123",
      );
      await user.click(screen.getByTestId("signup-submit"));

      expect(screen.getByTestId("google-signup")).toBeDisabled();
      expect(screen.getByTestId("facebook-signup")).toBeDisabled();

      resolveFetch({
        ok: true,
        json: async () => ({ user: {} }),
      } as unknown as Response);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalled();
      });
    });
  });

  describe("Form Validation", () => {
    it("shows error when passwords do not match", async () => {
      const user = userEvent.setup();
      render(<SignUpPage />);

      await user.type(screen.getByTestId("name-input"), "Test User");
      await user.type(screen.getByTestId("email-input"), "test@example.com");
      await user.type(screen.getByTestId("password-input"), "password123");
      await user.type(
        screen.getByTestId("confirm-password-input"),
        "differentpassword",
      );
      await user.click(screen.getByTestId("signup-submit"));

      await waitFor(() => {
        expect(screen.getByTestId("signup-error")).toHaveTextContent(
          "passwordsDoNotMatch",
        );
      });

      // Should not call fetch when passwords don't match
      expect(global.fetch).not.toHaveBeenCalled();
    });

    it("does not submit form when passwords are empty", async () => {
      const user = userEvent.setup();
      render(<SignUpPage />);

      await user.type(screen.getByTestId("name-input"), "Test User");
      await user.type(screen.getByTestId("email-input"), "test@example.com");
      // Leave password fields empty
      await user.click(screen.getByTestId("signup-submit"));
      // The form has required validation, so it won't submit
      // Just check that fetch is not called
      expect(global.fetch).not.toHaveBeenCalled();
    });
  });

  describe("Successful Sign-Up", () => {
    it("handles successful sign up with auto-login", async () => {
      const user = userEvent.setup();

      // Mock successful signup
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ user: { id: "1", email: "test@example.com" } }),
        })
        // Mock successful auto-signin
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ user: { email: "test@example.com" } }),
        });

      render(<SignUpPage />);

      await user.type(screen.getByTestId("name-input"), "Test User");
      await user.type(screen.getByTestId("email-input"), "test@example.com");
      await user.type(screen.getByTestId("password-input"), "password123");
      await user.type(
        screen.getByTestId("confirm-password-input"),
        "password123",
      );
      await user.click(screen.getByTestId("signup-submit"));

      // Wait for signup API call
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          "/api/auth/signup",
          expect.objectContaining({
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: "Test User",
              email: "test@example.com",
              password: "password123",
            }),
          }),
        );
      });

      // Wait for auto-signin API call
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

    it("redirects to sign-in when signup succeeds but auto-login fails", async () => {
      const user = userEvent.setup();

      // Mock successful signup
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ user: { id: "1", email: "test@example.com" } }),
        })
        // Mock failed auto-signin
        .mockResolvedValueOnce({
          ok: false,
          json: async () => ({ error: "Sign in failed" }),
        });

      render(<SignUpPage />);

      await user.type(screen.getByTestId("name-input"), "Test User");
      await user.type(screen.getByTestId("email-input"), "test@example.com");
      await user.type(screen.getByTestId("password-input"), "password123");
      await user.type(
        screen.getByTestId("confirm-password-input"),
        "password123",
      );
      await user.click(screen.getByTestId("signup-submit"));

      // Wait for error and redirect
      await waitFor(() => {
        expect(screen.getByTestId("signup-error")).toHaveTextContent(
          "accountCreatedSignInFailed",
        );
      });

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith("/sign-in");
      });
    });
  });

  describe("Sign-Up Errors", () => {
    it("handles email already exists error", async () => {
      const user = userEvent.setup();
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 409,
        json: async () => ({ error: "Email already registered" }),
      });

      render(<SignUpPage />);

      await user.type(screen.getByTestId("name-input"), "Test User");
      await user.type(
        screen.getByTestId("email-input"),
        "existing@example.com",
      );
      await user.type(screen.getByTestId("password-input"), "password123");
      await user.type(
        screen.getByTestId("confirm-password-input"),
        "password123",
      );
      await user.click(screen.getByTestId("signup-submit"));

      await waitFor(() => {
        expect(screen.getByTestId("signup-error")).toHaveTextContent(
          "Email already registered",
        );
      });
    });

    it("handles weak password error", async () => {
      const user = userEvent.setup();
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({
          error: "Password must be at least 8 characters",
        }),
      });

      render(<SignUpPage />);

      await user.type(screen.getByTestId("name-input"), "Test User");
      await user.type(screen.getByTestId("email-input"), "test@example.com");
      await user.type(screen.getByTestId("password-input"), "12345678");
      await user.type(screen.getByTestId("confirm-password-input"), "12345678");
      await user.click(screen.getByTestId("signup-submit"));

      await waitFor(() => {
        expect(screen.getByTestId("signup-error")).toHaveTextContent(
          "Password must be at least 8 characters",
        );
      });
    });

    it("handles invalid email format error", async () => {
      const user = userEvent.setup();
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({ error: "Invalid email format" }),
      });

      render(<SignUpPage />);

      await user.type(screen.getByTestId("name-input"), "Test User");
      await user.type(screen.getByTestId("email-input"), "test@example.com");
      await user.type(screen.getByTestId("password-input"), "password123");
      await user.type(
        screen.getByTestId("confirm-password-input"),
        "password123",
      );
      await user.click(screen.getByTestId("signup-submit"));

      await waitFor(() => {
        expect(screen.getByTestId("signup-error")).toHaveTextContent(
          "Invalid email format",
        );
      });
    });

    it("handles rate limit error", async () => {
      const user = userEvent.setup();
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 429,
        json: async () => ({
          error: "Too many signup attempts. Please try again later.",
        }),
      });

      render(<SignUpPage />);

      await user.type(screen.getByTestId("name-input"), "Test User");
      await user.type(screen.getByTestId("email-input"), "test@example.com");
      await user.type(screen.getByTestId("password-input"), "password123");
      await user.type(
        screen.getByTestId("confirm-password-input"),
        "password123",
      );
      await user.click(screen.getByTestId("signup-submit"));

      await waitFor(() => {
        expect(screen.getByTestId("signup-error")).toHaveTextContent(
          "Too many signup attempts. Please try again later.",
        );
      });
    });

    it("handles server error with generic message", async () => {
      const user = userEvent.setup();
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({}),
      });

      render(<SignUpPage />);

      await user.type(screen.getByTestId("name-input"), "Test User");
      await user.type(screen.getByTestId("email-input"), "test@example.com");
      await user.type(screen.getByTestId("password-input"), "password123");
      await user.type(
        screen.getByTestId("confirm-password-input"),
        "password123",
      );
      await user.click(screen.getByTestId("signup-submit"));

      await waitFor(() => {
        expect(screen.getByTestId("signup-error")).toHaveTextContent(
          "somethingWentWrong",
        );
      });
    });

    it("handles network error", async () => {
      const user = userEvent.setup();
      (global.fetch as jest.Mock).mockRejectedValueOnce(
        new Error("Network connection lost"),
      );

      render(<SignUpPage />);

      await user.type(screen.getByTestId("name-input"), "Test User");
      await user.type(screen.getByTestId("email-input"), "test@example.com");
      await user.type(screen.getByTestId("password-input"), "password123");
      await user.type(
        screen.getByTestId("confirm-password-input"),
        "password123",
      );
      await user.click(screen.getByTestId("signup-submit"));

      await waitFor(() => {
        expect(screen.getByTestId("signup-error")).toHaveTextContent(
          "somethingWentWrong",
        );
      });
    });
  });

  describe("Loading States", () => {
    it("shows loading state during submission", async () => {
      const user = userEvent.setup();
      let resolveFetch: (
        value: Response | PromiseLike<Response>,
      ) => void = () => {};
      const fetchPromise = new Promise<Response>((resolve) => {
        resolveFetch = resolve;
      });
      (global.fetch as jest.Mock).mockReturnValue(fetchPromise);

      render(<SignUpPage />);

      await user.type(screen.getByTestId("name-input"), "Test User");
      await user.type(screen.getByTestId("email-input"), "test@example.com");
      await user.type(screen.getByTestId("password-input"), "password123");
      await user.type(
        screen.getByTestId("confirm-password-input"),
        "password123",
      );
      await user.click(screen.getByTestId("signup-submit"));

      // Check all inputs are disabled during loading
      expect(screen.getByTestId("signup-submit")).toBeDisabled();
      expect(screen.getByTestId("signup-submit")).toHaveTextContent(
        "signingUp",
      );
      expect(screen.getByTestId("name-input")).toBeDisabled();
      expect(screen.getByTestId("email-input")).toBeDisabled();
      expect(screen.getByTestId("password-input")).toBeDisabled();
      expect(screen.getByTestId("confirm-password-input")).toBeDisabled();

      resolveFetch({
        ok: true,
        json: async () => ({ user: {} }),
      } as unknown as Response);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalled();
      });
    });

    it("re-enables form after error", async () => {
      const user = userEvent.setup();
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: "Some error" }),
      });

      render(<SignUpPage />);

      await user.type(screen.getByTestId("name-input"), "Test User");
      await user.type(screen.getByTestId("email-input"), "test@example.com");
      await user.type(screen.getByTestId("password-input"), "password123");
      await user.type(
        screen.getByTestId("confirm-password-input"),
        "password123",
      );
      await user.click(screen.getByTestId("signup-submit"));

      // Wait for error
      await waitFor(() => {
        expect(screen.getByTestId("signup-error")).toBeInTheDocument();
      });

      // Form should be re-enabled
      expect(screen.getByTestId("signup-submit")).not.toBeDisabled();
      expect(screen.getByTestId("name-input")).not.toBeDisabled();
      expect(screen.getByTestId("email-input")).not.toBeDisabled();
      expect(screen.getByTestId("password-input")).not.toBeDisabled();
      expect(screen.getByTestId("confirm-password-input")).not.toBeDisabled();
    });
  });

  describe("Error Clearing", () => {
    it("clears previous error when submitting again", async () => {
      const user = userEvent.setup();

      // First submission fails
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: "First error" }),
      });

      render(<SignUpPage />);

      await user.type(screen.getByTestId("name-input"), "Test User");
      await user.type(screen.getByTestId("email-input"), "test@example.com");
      await user.type(screen.getByTestId("password-input"), "password123");
      await user.type(
        screen.getByTestId("confirm-password-input"),
        "password123",
      );
      await user.click(screen.getByTestId("signup-submit"));

      // Wait for first error
      await waitFor(() => {
        expect(screen.getByTestId("signup-error")).toHaveTextContent(
          "First error",
        );
      });

      // Second submission with different error
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: "Second error" }),
      });

      await user.click(screen.getByTestId("signup-submit"));

      // Wait for second error (first error should be cleared)
      await waitFor(() => {
        expect(screen.getByTestId("signup-error")).toHaveTextContent(
          "Second error",
        );
      });
    });
  });

  describe("Input Interaction", () => {
    it("allows typing in all input fields", async () => {
      const user = userEvent.setup();
      render(<SignUpPage />);

      await user.type(screen.getByTestId("name-input"), "John Doe");
      await user.type(screen.getByTestId("email-input"), "john@example.com");
      await user.type(screen.getByTestId("password-input"), "securepass123");
      await user.type(
        screen.getByTestId("confirm-password-input"),
        "securepass123",
      );

      expect(screen.getByTestId("name-input")).toHaveValue("John Doe");
      expect(screen.getByTestId("email-input")).toHaveValue("john@example.com");
      expect(screen.getByTestId("password-input")).toHaveValue("securepass123");
      expect(screen.getByTestId("confirm-password-input")).toHaveValue(
        "securepass123",
      );
    });
  });
});
