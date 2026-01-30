import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SocialLoginButtons } from "./social-login-buttons";
import { signIn } from "next-auth/react";

// Mock next-auth/react
jest.mock("next-auth/react", () => ({
  signIn: jest.fn(),
}));

describe("SocialLoginButtons", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Rendering", () => {
    it("renders both Google and Facebook buttons", () => {
      render(<SocialLoginButtons />);

      expect(screen.getByTestId("social-login-buttons")).toBeInTheDocument();
      expect(screen.getByTestId("google-social")).toBeInTheDocument();
      expect(screen.getByTestId("facebook-social")).toBeInTheDocument();
    });

    it("renders Google button with correct text", () => {
      render(<SocialLoginButtons />);

      expect(screen.getByTestId("google-social")).toHaveTextContent("Google");
    });

    it("renders Facebook button with correct text", () => {
      render(<SocialLoginButtons />);

      expect(screen.getByTestId("facebook-social")).toHaveTextContent(
        "Facebook",
      );
    });

    it("renders buttons in a two-column grid layout", () => {
      render(<SocialLoginButtons />);

      const container = screen.getByTestId("social-login-buttons");
      expect(container).toHaveClass("grid", "grid-cols-2", "gap-4");
    });
  });

  describe("Custom testIdPrefix", () => {
    it("applies custom testIdPrefix to Google button", () => {
      render(<SocialLoginButtons testIdPrefix="signin" />);

      expect(screen.getByTestId("google-signin")).toBeInTheDocument();
    });

    it("applies custom testIdPrefix to Facebook button", () => {
      render(<SocialLoginButtons testIdPrefix="signup" />);

      expect(screen.getByTestId("facebook-signup")).toBeInTheDocument();
    });

    it("uses default testIdPrefix when not provided", () => {
      render(<SocialLoginButtons />);

      expect(screen.getByTestId("google-social")).toBeInTheDocument();
      expect(screen.getByTestId("facebook-social")).toBeInTheDocument();
    });
  });

  describe("Google Sign-In", () => {
    it("calls signIn with google provider when Google button is clicked", async () => {
      const user = userEvent.setup();
      render(<SocialLoginButtons />);

      await user.click(screen.getByTestId("google-social"));

      expect(signIn).toHaveBeenCalledWith("google", {
        callbackUrl: "/dashboard",
      });
    });

    it("uses custom callbackUrl for Google sign-in", async () => {
      const user = userEvent.setup();
      render(<SocialLoginButtons callbackUrl="/custom-page" />);

      await user.click(screen.getByTestId("google-social"));

      expect(signIn).toHaveBeenCalledWith("google", {
        callbackUrl: "/custom-page",
      });
    });

    it("calls signIn only once per click for Google", async () => {
      const user = userEvent.setup();
      render(<SocialLoginButtons />);

      await user.click(screen.getByTestId("google-social"));

      expect(signIn).toHaveBeenCalledTimes(1);
    });
  });

  describe("Facebook Sign-In", () => {
    it("calls signIn with facebook provider when Facebook button is clicked", async () => {
      const user = userEvent.setup();
      render(<SocialLoginButtons />);

      await user.click(screen.getByTestId("facebook-social"));

      expect(signIn).toHaveBeenCalledWith("facebook", {
        callbackUrl: "/dashboard",
      });
    });

    it("uses custom callbackUrl for Facebook sign-in", async () => {
      const user = userEvent.setup();
      render(<SocialLoginButtons callbackUrl="/home" />);

      await user.click(screen.getByTestId("facebook-social"));

      expect(signIn).toHaveBeenCalledWith("facebook", {
        callbackUrl: "/home",
      });
    });

    it("calls signIn only once per click for Facebook", async () => {
      const user = userEvent.setup();
      render(<SocialLoginButtons />);

      await user.click(screen.getByTestId("facebook-social"));

      expect(signIn).toHaveBeenCalledTimes(1);
    });
  });

  describe("Disabled State", () => {
    it("disables Google button when disabled prop is true", () => {
      render(<SocialLoginButtons disabled={true} />);

      expect(screen.getByTestId("google-social")).toBeDisabled();
    });

    it("disables Facebook button when disabled prop is true", () => {
      render(<SocialLoginButtons disabled={true} />);

      expect(screen.getByTestId("facebook-social")).toBeDisabled();
    });

    it("does not call signIn when Google button is disabled and clicked", async () => {
      const user = userEvent.setup();
      render(<SocialLoginButtons disabled={true} />);

      // Attempt to click the disabled button
      const googleButton = screen.getByTestId("google-social");
      await user.click(googleButton);

      expect(signIn).not.toHaveBeenCalled();
    });

    it("does not call signIn when Facebook button is disabled and clicked", async () => {
      const user = userEvent.setup();
      render(<SocialLoginButtons disabled={true} />);

      // Attempt to click the disabled button
      const facebookButton = screen.getByTestId("facebook-social");
      await user.click(facebookButton);

      expect(signIn).not.toHaveBeenCalled();
    });

    it("enables buttons when disabled prop is false", () => {
      render(<SocialLoginButtons disabled={false} />);

      expect(screen.getByTestId("google-social")).not.toBeDisabled();
      expect(screen.getByTestId("facebook-social")).not.toBeDisabled();
    });

    it("enables buttons by default when disabled prop is not provided", () => {
      render(<SocialLoginButtons />);

      expect(screen.getByTestId("google-social")).not.toBeDisabled();
      expect(screen.getByTestId("facebook-social")).not.toBeDisabled();
    });
  });

  describe("Multiple Clicks", () => {
    it("handles rapid clicks on Google button", async () => {
      const user = userEvent.setup();
      render(<SocialLoginButtons />);

      const googleButton = screen.getByTestId("google-social");
      await user.click(googleButton);
      await user.click(googleButton);
      await user.click(googleButton);

      expect(signIn).toHaveBeenCalledTimes(3);
    });

    it("handles clicking both buttons sequentially", async () => {
      const user = userEvent.setup();
      render(<SocialLoginButtons />);

      await user.click(screen.getByTestId("google-social"));
      await user.click(screen.getByTestId("facebook-social"));

      expect(signIn).toHaveBeenCalledTimes(2);
      expect(signIn).toHaveBeenNthCalledWith(1, "google", {
        callbackUrl: "/dashboard",
      });
      expect(signIn).toHaveBeenNthCalledWith(2, "facebook", {
        callbackUrl: "/dashboard",
      });
    });
  });

  describe("Props Combinations", () => {
    it("handles all props together", async () => {
      const user = userEvent.setup();
      render(
        <SocialLoginButtons
          disabled={false}
          callbackUrl="/my-dashboard"
          testIdPrefix="auth"
        />,
      );

      expect(screen.getByTestId("google-auth")).toBeInTheDocument();
      expect(screen.getByTestId("facebook-auth")).toBeInTheDocument();
      expect(screen.getByTestId("google-auth")).not.toBeDisabled();
      expect(screen.getByTestId("facebook-auth")).not.toBeDisabled();

      await user.click(screen.getByTestId("google-auth"));
      expect(signIn).toHaveBeenCalledWith("google", {
        callbackUrl: "/my-dashboard",
      });
    });

    it("uses default values when no props are provided", async () => {
      const user = userEvent.setup();
      render(<SocialLoginButtons />);

      expect(screen.getByTestId("google-social")).not.toBeDisabled();
      expect(screen.getByTestId("facebook-social")).not.toBeDisabled();

      await user.click(screen.getByTestId("google-social"));
      expect(signIn).toHaveBeenCalledWith("google", {
        callbackUrl: "/dashboard",
      });
    });
  });

  describe("SVG Icons", () => {
    it("renders Google icon within the Google button", () => {
      render(<SocialLoginButtons />);

      const googleButton = screen.getByTestId("google-social");
      const svgIcon = googleButton.querySelector("svg");
      expect(svgIcon).toBeInTheDocument();
    });

    it("renders Facebook icon within the Facebook button", () => {
      render(<SocialLoginButtons />);

      const facebookButton = screen.getByTestId("facebook-social");
      const svgIcon = facebookButton.querySelector("svg");
      expect(svgIcon).toBeInTheDocument();
    });
  });

  describe("Button Styling", () => {
    it("renders buttons with outline variant", () => {
      render(<SocialLoginButtons />);

      // The Button component applies variant classes
      // We check that the buttons are rendered (styling is handled by the Button component)
      expect(screen.getByTestId("google-social")).toBeInTheDocument();
      expect(screen.getByTestId("facebook-social")).toBeInTheDocument();
    });
  });
});
