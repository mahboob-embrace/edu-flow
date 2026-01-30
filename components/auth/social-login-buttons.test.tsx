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
    it("renders Google and Facebook buttons with correct text and layout", () => {
      render(<SocialLoginButtons />);

      const container = screen.getByTestId("social-login-buttons");
      expect(container).toBeInTheDocument();
      expect(container).toHaveClass("grid", "grid-cols-2", "gap-4");

      const googleButton = screen.getByTestId("google-social");
      expect(googleButton).toBeInTheDocument();
      expect(googleButton).toHaveTextContent("Google");

      const facebookButton = screen.getByTestId("facebook-social");
      expect(facebookButton).toBeInTheDocument();
      expect(facebookButton).toHaveTextContent("Facebook");
    });
  });

  describe("Custom testIdPrefix", () => {
    it("applies custom testIdPrefix to both buttons", () => {
      render(<SocialLoginButtons testIdPrefix="custom" />);

      expect(screen.getByTestId("google-custom")).toBeInTheDocument();
      expect(screen.getByTestId("facebook-custom")).toBeInTheDocument();
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
    it("disables both buttons when disabled prop is true", () => {
      render(<SocialLoginButtons disabled={true} />);

      expect(screen.getByTestId("google-social")).toBeDisabled();
      expect(screen.getByTestId("facebook-social")).toBeDisabled();
    });

    it("does not call signIn when disabled buttons are clicked", async () => {
      const user = userEvent.setup();
      render(<SocialLoginButtons disabled={true} />);

      // user-event will not fire click events on disabled elements
      await user.click(screen.getByTestId("google-social"));
      await user.click(screen.getByTestId("facebook-social"));

      expect(signIn).not.toHaveBeenCalled();
    });

    it("enables buttons by default", () => {
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
    it("renders SVG icons within both buttons", () => {
      render(<SocialLoginButtons />);

      const googleButton = screen.getByTestId("google-social");
      const facebookButton = screen.getByTestId("facebook-social");

      expect(googleButton.querySelector("svg")).toBeInTheDocument();
      expect(facebookButton.querySelector("svg")).toBeInTheDocument();
    });
  });
});
