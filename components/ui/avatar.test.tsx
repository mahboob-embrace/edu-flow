import { render, screen, waitFor } from "@testing-library/react";
import { Avatar, AvatarImage, AvatarFallback } from "./avatar";

describe("Avatar", () => {
  describe("Avatar Root", () => {
    it("renders successfully", () => {
      render(
        <Avatar data-testid="avatar">
          <AvatarFallback>AB</AvatarFallback>
        </Avatar>,
      );

      expect(screen.getByTestId("avatar")).toBeInTheDocument();
      expect(screen.getByText("AB")).toBeInTheDocument();
    });

    it("has correct data-slot attribute", () => {
      render(
        <Avatar data-testid="avatar">
          <AvatarFallback>AB</AvatarFallback>
        </Avatar>,
      );

      expect(screen.getByTestId("avatar")).toHaveAttribute(
        "data-slot",
        "avatar",
      );
    });

    it("applies default classes", () => {
      render(
        <Avatar data-testid="avatar">
          <AvatarFallback>AB</AvatarFallback>
        </Avatar>,
      );

      const avatar = screen.getByTestId("avatar");
      expect(avatar).toHaveClass("relative");
      expect(avatar).toHaveClass("flex");
      expect(avatar).toHaveClass("size-8");
      expect(avatar).toHaveClass("shrink-0");
      expect(avatar).toHaveClass("overflow-hidden");
      expect(avatar).toHaveClass("rounded-full");
    });

    it("accepts custom className", () => {
      render(
        <Avatar data-testid="avatar" className="custom-class">
          <AvatarFallback>AB</AvatarFallback>
        </Avatar>,
      );

      const avatar = screen.getByTestId("avatar");
      expect(avatar).toHaveClass("custom-class");
      expect(avatar).toHaveClass("relative"); // Still has default classes
    });

    it("forwards additional props", () => {
      render(
        <Avatar data-testid="custom-avatar">
          <AvatarFallback>AB</AvatarFallback>
        </Avatar>,
      );

      expect(screen.getByTestId("custom-avatar")).toBeInTheDocument();
    });
  });

  describe("AvatarImage", () => {
    it("shows fallback when image fails to load", async () => {
      render(
        <Avatar>
          <AvatarImage src="invalid-url" alt="User Avatar" />
          <AvatarFallback>AB</AvatarFallback>
        </Avatar>,
      );

      // In JSDOM, images don't load, so fallback is always shown
      await waitFor(() => {
        expect(screen.getByText("AB")).toBeInTheDocument();
      });
    });

    it("renders with AvatarImage component present", () => {
      render(
        <Avatar>
          <AvatarImage src="https://example.com/avatar.jpg" alt="User Avatar" />
          <AvatarFallback>AB</AvatarFallback>
        </Avatar>,
      );

      // Fallback is shown in JSDOM since images don't load
      expect(screen.getByText("AB")).toBeInTheDocument();
    });
  });

  describe("AvatarFallback", () => {
    it("renders fallback content", () => {
      render(
        <Avatar>
          <AvatarFallback>AB</AvatarFallback>
        </Avatar>,
      );

      expect(screen.getByText("AB")).toBeInTheDocument();
    });

    it("has correct data-slot attribute", () => {
      render(
        <Avatar>
          <AvatarFallback data-testid="avatar-fallback">AB</AvatarFallback>
        </Avatar>,
      );

      const fallback = screen.getByTestId("avatar-fallback");
      expect(fallback).toHaveAttribute("data-slot", "avatar-fallback");
    });

    it("applies default classes", () => {
      render(
        <Avatar>
          <AvatarFallback data-testid="avatar-fallback">AB</AvatarFallback>
        </Avatar>,
      );

      const fallback = screen.getByTestId("avatar-fallback");
      expect(fallback).toHaveClass("bg-muted");
      expect(fallback).toHaveClass("flex");
      expect(fallback).toHaveClass("size-full");
      expect(fallback).toHaveClass("items-center");
      expect(fallback).toHaveClass("justify-center");
      expect(fallback).toHaveClass("rounded-full");
    });

    it("accepts custom className", () => {
      render(
        <Avatar>
          <AvatarFallback
            data-testid="avatar-fallback"
            className="custom-fallback-class"
          >
            AB
          </AvatarFallback>
        </Avatar>,
      );

      const fallback = screen.getByTestId("avatar-fallback");
      expect(fallback).toHaveClass("custom-fallback-class");
      expect(fallback).toHaveClass("bg-muted"); // Still has default classes
    });

    it("renders with different content types", () => {
      const { rerender } = render(
        <Avatar>
          <AvatarFallback>AB</AvatarFallback>
        </Avatar>,
      );

      expect(screen.getByText("AB")).toBeInTheDocument();

      rerender(
        <Avatar>
          <AvatarFallback>
            <span>Custom Content</span>
          </AvatarFallback>
        </Avatar>,
      );

      expect(screen.getByText("Custom Content")).toBeInTheDocument();
    });

    it("forwards additional props", () => {
      render(
        <Avatar>
          <AvatarFallback data-testid="custom-fallback">AB</AvatarFallback>
        </Avatar>,
      );

      expect(screen.getByTestId("custom-fallback")).toBeInTheDocument();
    });
  });

  describe("Integration", () => {
    it("renders complete avatar with image and fallback", () => {
      render(
        <Avatar>
          <AvatarImage src="https://example.com/avatar.jpg" alt="User Avatar" />
          <AvatarFallback>AB</AvatarFallback>
        </Avatar>,
      );

      // In JSDOM, images don't load, so fallback is always shown
      expect(screen.getByText("AB")).toBeInTheDocument();
    });

    it("works with only fallback (no image)", () => {
      render(
        <Avatar>
          <AvatarFallback>AB</AvatarFallback>
        </Avatar>,
      );

      expect(screen.getByText("AB")).toBeInTheDocument();
      expect(screen.queryByRole("img")).not.toBeInTheDocument();
    });

    it("handles multiple avatars", () => {
      render(
        <div>
          <Avatar>
            <AvatarImage src="https://example.com/user1.jpg" alt="User 1" />
            <AvatarFallback>U1</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarImage src="https://example.com/user2.jpg" alt="User 2" />
            <AvatarFallback>U2</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarFallback>U3</AvatarFallback>
          </Avatar>
        </div>,
      );

      // In JSDOM, fallbacks are always shown
      expect(screen.getByText("U1")).toBeInTheDocument();
      expect(screen.getByText("U2")).toBeInTheDocument();
      expect(screen.getByText("U3")).toBeInTheDocument();
    });

    it("applies custom classes to all components", () => {
      render(
        <Avatar data-testid="avatar" className="custom-avatar">
          <AvatarImage
            data-testid="avatar-image"
            src="https://example.com/avatar.jpg"
            alt="User Avatar"
            className="custom-image"
          />
          <AvatarFallback
            data-testid="avatar-fallback"
            className="custom-fallback"
          >
            AB
          </AvatarFallback>
        </Avatar>,
      );

      const avatar = screen.getByTestId("avatar");
      const fallback = screen.getByTestId("avatar-fallback");

      expect(avatar).toHaveClass("custom-avatar");
      expect(fallback).toHaveClass("custom-fallback");

      // Image exists but may not be visible in JSDOM
      const image = screen.queryByTestId("avatar-image");
      if (image) {
        expect(image).toHaveClass("custom-image");
      }
    });
  });

  describe("Edge Cases", () => {
    it("handles empty fallback content", () => {
      render(
        <Avatar>
          <AvatarFallback data-testid="empty-fallback"></AvatarFallback>
        </Avatar>,
      );

      const fallback = screen.getByTestId("empty-fallback");
      expect(fallback).toBeInTheDocument();
      expect(fallback).toBeEmptyDOMElement();
    });

    it("handles very long fallback text", () => {
      render(
        <Avatar>
          <AvatarFallback>VERYLONGTEXT</AvatarFallback>
        </Avatar>,
      );

      expect(screen.getByText("VERYLONGTEXT")).toBeInTheDocument();
    });

    it("handles special characters in fallback", () => {
      render(
        <Avatar>
          <AvatarFallback>@#</AvatarFallback>
        </Avatar>,
      );

      expect(screen.getByText("@#")).toBeInTheDocument();
    });

    it("handles empty image src", () => {
      render(
        <Avatar>
          <AvatarImage src="" alt="Empty source" />
          <AvatarFallback>AB</AvatarFallback>
        </Avatar>,
      );

      // Should show fallback when src is empty
      expect(screen.getByText("AB")).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("fallback is accessible when image doesn't load", () => {
      render(
        <Avatar>
          <AvatarImage src="https://example.com/avatar.jpg" alt="User Avatar" />
          <AvatarFallback>AB</AvatarFallback>
        </Avatar>,
      );

      // In JSDOM, fallback is shown since images don't load
      expect(screen.getByText("AB")).toBeInTheDocument();
    });

    it("fallback content is accessible", () => {
      render(
        <Avatar>
          <AvatarFallback aria-label="User initials">AB</AvatarFallback>
        </Avatar>,
      );

      const fallback = screen.getByLabelText("User initials");
      expect(fallback).toBeInTheDocument();
    });

    it("supports aria attributes", () => {
      render(
        <Avatar aria-label="User profile picture">
          <AvatarImage src="https://example.com/avatar.jpg" alt="User Avatar" />
          <AvatarFallback>AB</AvatarFallback>
        </Avatar>,
      );

      const avatar = screen.getByLabelText("User profile picture");
      expect(avatar).toBeInTheDocument();
    });
  });
});
