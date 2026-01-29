import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SessionProvider } from "@/components/auth/session-provider";
import { UserButton } from "@/components/auth/user-button";
import { useSession, signOut } from "next-auth/react";

// Mock next-auth/react
jest.mock("next-auth/react", () => ({
  useSession: jest.fn(),
  signOut: jest.fn(),
  SessionProvider: ({ children }: { children: React.ReactNode }) => children,
}));

// Mock next/link
jest.mock("next/link", () => {
  return function MockLink({
    children,
    href,
    ...props
  }: {
    children: React.ReactNode;
    href: string;
    [key: string]: unknown;
  }) {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    );
  };
});

const mockUseSession = useSession as jest.MockedFunction<typeof useSession>;
const mockSignOut = signOut as jest.MockedFunction<typeof signOut>;

// Helper function to render UserButton with SessionProvider
function renderUserButton() {
  return render(
    <SessionProvider>
      <UserButton />
    </SessionProvider>,
  );
}

describe("UserButton", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Loading State", () => {
    it("renders a disabled button with user icon while session is loading", () => {
      mockUseSession.mockReturnValue({
        data: null,
        status: "loading",
        update: jest.fn(),
      });

      renderUserButton();

      const button = screen.getByTestId("user-button-loading");
      expect(button).toBeInTheDocument();
      expect(button).toBeDisabled();
    });

    it("does not render sign in link during loading", () => {
      mockUseSession.mockReturnValue({
        data: null,
        status: "loading",
        update: jest.fn(),
      });

      renderUserButton();

      expect(screen.queryByRole("link")).not.toBeInTheDocument();
    });
  });

  describe("Unauthenticated State", () => {
    beforeEach(() => {
      mockUseSession.mockReturnValue({
        data: null,
        status: "unauthenticated",
        update: jest.fn(),
      });
    });

    it("renders Sign In button when user is not authenticated", () => {
      renderUserButton();

      const signInLink = screen.getByTestId("user-button-sign-in");
      expect(signInLink).toBeInTheDocument();
      expect(signInLink).toHaveTextContent(/sign in/i);
    });

    it("Sign In button links to /sign-in page", () => {
      renderUserButton();

      const signInLink = screen.getByTestId("user-button-sign-in");
      expect(signInLink).toHaveAttribute("href", "/sign-in");
    });

    it("does not render user avatar when unauthenticated", () => {
      renderUserButton();

      expect(screen.queryByRole("img")).not.toBeInTheDocument();
    });

    it("does not render dropdown menu when unauthenticated", () => {
      renderUserButton();

      expect(screen.queryByText(/sign out/i)).not.toBeInTheDocument();
    });
  });

  describe("Authenticated State", () => {
    const mockSession = {
      user: {
        id: "user-123",
        name: "John Doe",
        email: "john.doe@example.com",
        image: "https://example.com/avatar.jpg",
      },
      expires: "2030-01-01T00:00:00.000Z",
    };

    beforeEach(() => {
      mockUseSession.mockReturnValue({
        data: mockSession,
        status: "authenticated",
        update: jest.fn(),
      });
    });

    it("renders user avatar button when authenticated", () => {
      renderUserButton();

      const avatarButton = screen.getByTestId("user-button-trigger");
      expect(avatarButton).toBeInTheDocument();
      expect(avatarButton).not.toBeDisabled();
    });

    it("displays user initials as fallback while image loads", () => {
      renderUserButton();

      // Radix Avatar shows fallback until image loads
      expect(
        screen.getByTestId("user-button-avatar-fallback"),
      ).toHaveTextContent("JD");
    });

    it("opens dropdown menu when avatar is clicked", async () => {
      const user = userEvent.setup();
      renderUserButton();

      const avatarButton = screen.getByTestId("user-button-trigger");
      await user.click(avatarButton);

      await waitFor(() => {
        expect(screen.getByTestId("user-button-name")).toBeInTheDocument();
      });
    });

    it("displays user name in dropdown menu", async () => {
      const user = userEvent.setup();
      renderUserButton();

      await user.click(screen.getByTestId("user-button-trigger"));

      await waitFor(() => {
        expect(screen.getByTestId("user-button-name")).toHaveTextContent(
          "John Doe",
        );
      });
    });

    it("displays user email in dropdown menu", async () => {
      const user = userEvent.setup();
      renderUserButton();

      await user.click(screen.getByTestId("user-button-trigger"));

      await waitFor(() => {
        expect(screen.getByTestId("user-button-email")).toHaveTextContent(
          "john.doe@example.com",
        );
      });
    });

    it("displays Sign out option in dropdown menu", async () => {
      const user = userEvent.setup();
      renderUserButton();

      await user.click(screen.getByTestId("user-button-trigger"));

      await waitFor(() => {
        expect(screen.getByTestId("user-button-sign-out")).toBeInTheDocument();
      });
    });

    it("calls signOut with correct callback URL when Sign out is clicked", async () => {
      const user = userEvent.setup();
      renderUserButton();

      await user.click(screen.getByTestId("user-button-trigger"));

      await waitFor(() => {
        expect(screen.getByTestId("user-button-sign-out")).toBeInTheDocument();
      });

      await user.click(screen.getByTestId("user-button-sign-out"));

      expect(mockSignOut).toHaveBeenCalledWith({ callbackUrl: "/" });
    });

    it("calls signOut exactly once when Sign out is clicked", async () => {
      const user = userEvent.setup();
      renderUserButton();

      await user.click(screen.getByTestId("user-button-trigger"));

      await waitFor(() => {
        expect(screen.getByTestId("user-button-sign-out")).toBeInTheDocument();
      });

      await user.click(screen.getByTestId("user-button-sign-out"));

      expect(mockSignOut).toHaveBeenCalledTimes(1);
    });
  });

  describe("Avatar Fallback", () => {
    it("displays initials as fallback when user has no image", () => {
      mockUseSession.mockReturnValue({
        data: {
          user: {
            id: "user-456",
            name: "Jane Smith",
            email: "jane@example.com",
            image: null,
          },
          expires: "2030-01-01T00:00:00.000Z",
        },
        status: "authenticated",
        update: jest.fn(),
      });

      renderUserButton();

      // Fallback should show "JS" for "Jane Smith"
      expect(
        screen.getByTestId("user-button-avatar-fallback"),
      ).toHaveTextContent("JS");
    });

    it("displays single initial for single-word name", () => {
      mockUseSession.mockReturnValue({
        data: {
          user: {
            id: "user-789",
            name: "Madonna",
            email: "madonna@example.com",
            image: null,
          },
          expires: "2030-01-01T00:00:00.000Z",
        },
        status: "authenticated",
        update: jest.fn(),
      });

      renderUserButton();

      expect(
        screen.getByTestId("user-button-avatar-fallback"),
      ).toHaveTextContent("M");
    });

    it('displays "U" as fallback when user has no name', () => {
      mockUseSession.mockReturnValue({
        data: {
          user: {
            id: "user-000",
            name: null,
            email: "noname@example.com",
            image: null,
          },
          expires: "2030-01-01T00:00:00.000Z",
        },
        status: "authenticated",
        update: jest.fn(),
      });

      renderUserButton();

      expect(
        screen.getByTestId("user-button-avatar-fallback"),
      ).toHaveTextContent("U");
    });

    it("displays initials in uppercase", () => {
      mockUseSession.mockReturnValue({
        data: {
          user: {
            id: "user-lowercase",
            name: "alice bob",
            email: "alice@example.com",
            image: null,
          },
          expires: "2030-01-01T00:00:00.000Z",
        },
        status: "authenticated",
        update: jest.fn(),
      });

      renderUserButton();

      expect(
        screen.getByTestId("user-button-avatar-fallback"),
      ).toHaveTextContent("AB");
    });

    it("handles three-word names correctly", () => {
      mockUseSession.mockReturnValue({
        data: {
          user: {
            id: "user-three",
            name: "John Michael Doe",
            email: "john@example.com",
            image: null,
          },
          expires: "2030-01-01T00:00:00.000Z",
        },
        status: "authenticated",
        update: jest.fn(),
      });

      renderUserButton();

      expect(
        screen.getByTestId("user-button-avatar-fallback"),
      ).toHaveTextContent("JMD");
    });
  });

  describe("Dropdown Menu Behavior", () => {
    const mockSession = {
      user: {
        id: "user-dropdown",
        name: "Test User",
        email: "test@example.com",
        image: null,
      },
      expires: "2030-01-01T00:00:00.000Z",
    };

    beforeEach(() => {
      mockUseSession.mockReturnValue({
        data: mockSession,
        status: "authenticated",
        update: jest.fn(),
      });
    });

    it("dropdown is closed by default", () => {
      renderUserButton();

      expect(screen.queryByTestId("user-button-name")).not.toBeInTheDocument();
      expect(
        screen.queryByTestId("user-button-sign-out"),
      ).not.toBeInTheDocument();
    });

    it("closes dropdown when clicking outside", async () => {
      // Use pointerEventsCheck: 0 to bypass Radix's pointer-events: none on body
      const user = userEvent.setup({ pointerEventsCheck: 0 });
      render(
        <div>
          <SessionProvider>
            <UserButton />
          </SessionProvider>
          <button data-testid="outside">Outside</button>
        </div>,
      );

      // Open dropdown
      await user.click(screen.getByTestId("user-button-trigger"));

      await waitFor(() => {
        expect(screen.getByTestId("user-button-sign-out")).toBeInTheDocument();
      });

      // Click outside
      await user.click(screen.getByTestId("outside"));

      await waitFor(() => {
        expect(
          screen.queryByTestId("user-button-sign-out"),
        ).not.toBeInTheDocument();
      });
    });

    it("closes dropdown when pressing Escape key", async () => {
      const user = userEvent.setup();
      renderUserButton();

      // Open dropdown
      await user.click(screen.getByTestId("user-button-trigger"));

      await waitFor(() => {
        expect(screen.getByTestId("user-button-sign-out")).toBeInTheDocument();
      });

      // Press Escape
      await user.keyboard("{Escape}");

      await waitFor(() => {
        expect(
          screen.queryByTestId("user-button-sign-out"),
        ).not.toBeInTheDocument();
      });
    });
  });

  describe("Edge Cases", () => {
    it("handles empty string image gracefully", () => {
      mockUseSession.mockReturnValue({
        data: {
          user: {
            id: "user-empty-img",
            name: "Empty Image",
            email: "empty@example.com",
            image: "",
          },
          expires: "2030-01-01T00:00:00.000Z",
        },
        status: "authenticated",
        update: jest.fn(),
      });

      renderUserButton();

      // Should show fallback initials
      expect(
        screen.getByTestId("user-button-avatar-fallback"),
      ).toHaveTextContent("EI");
    });

    it("handles undefined user name with U fallback", () => {
      mockUseSession.mockReturnValue({
        data: {
          user: {
            id: "user-no-name",
            name: undefined,
            email: "unnamed@example.com",
            image: "https://example.com/avatar.jpg",
          },
          expires: "2030-01-01T00:00:00.000Z",
        },
        status: "authenticated",
        update: jest.fn(),
      });

      renderUserButton();

      // In JSDOM, image doesn't load, so fallback "U" is shown
      expect(
        screen.getByTestId("user-button-avatar-fallback"),
      ).toHaveTextContent("U");
    });

    it("handles user with only email (no name or image)", async () => {
      const user = userEvent.setup();
      mockUseSession.mockReturnValue({
        data: {
          user: {
            id: "user-email-only",
            name: undefined,
            email: "onlyemail@example.com",
            image: undefined,
          },
          expires: "2030-01-01T00:00:00.000Z",
        },
        status: "authenticated",
        update: jest.fn(),
      });

      renderUserButton();

      // Should show "U" fallback
      expect(
        screen.getByTestId("user-button-avatar-fallback"),
      ).toHaveTextContent("U");

      // Open dropdown and verify email is shown
      await user.click(screen.getByTestId("user-button-trigger"));

      await waitFor(() => {
        expect(screen.getByTestId("user-button-email")).toHaveTextContent(
          "onlyemail@example.com",
        );
      });
    });
  });

  describe("Accessibility", () => {
    it("avatar button is focusable when authenticated", () => {
      mockUseSession.mockReturnValue({
        data: {
          user: {
            id: "user-a11y",
            name: "Accessible User",
            email: "a11y@example.com",
            image: null,
          },
          expires: "2030-01-01T00:00:00.000Z",
        },
        status: "authenticated",
        update: jest.fn(),
      });

      renderUserButton();

      const button = screen.getByTestId("user-button-trigger");
      button.focus();
      expect(button).toHaveFocus();
    });

    it("Sign In link is focusable when unauthenticated", () => {
      mockUseSession.mockReturnValue({
        data: null,
        status: "unauthenticated",
        update: jest.fn(),
      });

      renderUserButton();

      const link = screen.getByTestId("user-button-sign-in");
      link.focus();
      expect(link).toHaveFocus();
    });

    it("can navigate dropdown menu with keyboard", async () => {
      const user = userEvent.setup();
      mockUseSession.mockReturnValue({
        data: {
          user: {
            id: "user-keyboard",
            name: "Keyboard User",
            email: "keyboard@example.com",
            image: null,
          },
          expires: "2030-01-01T00:00:00.000Z",
        },
        status: "authenticated",
        update: jest.fn(),
      });

      renderUserButton();

      // Open dropdown with Enter key
      const avatarButton = screen.getByTestId("user-button-trigger");
      avatarButton.focus();
      await user.keyboard("{Enter}");

      await waitFor(() => {
        expect(screen.getByTestId("user-button-sign-out")).toBeInTheDocument();
      });
    });
  });
});
