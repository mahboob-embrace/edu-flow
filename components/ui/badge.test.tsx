import { render, screen, fireEvent } from "@testing-library/react";
import { Badge } from "./badge";

describe("Badge", () => {
  describe("Rendering", () => {
    it("renders successfully with text content", () => {
      render(<Badge data-testid="badge">Test Badge</Badge>);

      expect(screen.getByTestId("badge")).toBeInTheDocument();
      expect(screen.getByText("Test Badge")).toBeInTheDocument();
    });

    it("has correct data-slot attribute", () => {
      render(<Badge data-testid="badge">Test</Badge>);

      const badge = screen.getByTestId("badge");
      expect(badge).toHaveAttribute("data-slot", "badge");
    });

    it("renders as a span by default", () => {
      render(<Badge data-testid="badge">Test</Badge>);

      const badge = screen.getByTestId("badge");
      expect(badge.tagName).toBe("SPAN");
    });

    it("applies default classes", () => {
      render(<Badge data-testid="badge">Test</Badge>);

      const badge = screen.getByTestId("badge");
      expect(badge).toHaveClass("inline-flex");
      expect(badge).toHaveClass("items-center");
      expect(badge).toHaveClass("justify-center");
      expect(badge).toHaveClass("rounded-full");
      expect(badge).toHaveClass("border");
      expect(badge).toHaveClass("px-2");
      expect(badge).toHaveClass("py-0.5");
      expect(badge).toHaveClass("text-xs");
      expect(badge).toHaveClass("font-medium");
    });

    it("accepts custom className", () => {
      render(
        <Badge data-testid="badge" className="custom-badge">
          Test
        </Badge>,
      );

      const badge = screen.getByTestId("badge");
      expect(badge).toHaveClass("custom-badge");
      expect(badge).toHaveClass("inline-flex"); // Still has default classes
    });

    it("forwards additional props", () => {
      render(
        <Badge data-testid="custom-badge" title="Badge Title">
          Test
        </Badge>,
      );

      const badge = screen.getByTestId("custom-badge");
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveAttribute("title", "Badge Title");
    });
  });

  describe("Variants", () => {
    it("renders with default variant", () => {
      render(<Badge data-testid="badge">Default</Badge>);

      const badge = screen.getByTestId("badge");
      expect(badge).toHaveClass("bg-primary");
      expect(badge).toHaveClass("text-primary-foreground");
      expect(badge).toHaveClass("border-transparent");
    });

    it("renders with secondary variant", () => {
      render(
        <Badge data-testid="badge" variant="secondary">
          Secondary
        </Badge>,
      );

      const badge = screen.getByTestId("badge");
      expect(badge).toHaveClass("bg-secondary");
      expect(badge).toHaveClass("text-secondary-foreground");
      expect(badge).toHaveClass("border-transparent");
    });

    it("renders with destructive variant", () => {
      render(<Badge variant="destructive">Destructive</Badge>);

      const badge = screen.getByText("Destructive");
      expect(badge).toHaveClass("bg-destructive");
      expect(badge).toHaveClass("text-white");
      expect(badge).toHaveClass("border-transparent");
    });

    it("renders with outline variant", () => {
      render(<Badge variant="outline">Outline</Badge>);

      const badge = screen.getByText("Outline");
      expect(badge).toHaveClass("text-foreground");
      // Outline variant doesn't set border-transparent
    });

    it("applies custom className with variant", () => {
      render(
        <Badge variant="secondary" className="custom-class">
          Test
        </Badge>,
      );

      const badge = screen.getByText("Test");
      expect(badge).toHaveClass("custom-class");
      expect(badge).toHaveClass("bg-secondary");
    });
  });

  describe("asChild Prop", () => {
    it("renders as span when asChild is false", () => {
      render(<Badge asChild={false}>Test</Badge>);

      const badge = screen.getByText("Test");
      expect(badge.tagName).toBe("SPAN");
    });

    it("renders as child component when asChild is true", () => {
      render(
        <Badge asChild>
          <button type="button">Button Badge</button>
        </Badge>,
      );

      const badge = screen.getByRole("button", { name: "Button Badge" });
      expect(badge).toBeInTheDocument();
      expect(badge.tagName).toBe("BUTTON");
      expect(badge).toHaveClass("inline-flex"); // Badge classes applied
    });

    it("applies badge classes to child when asChild is true", () => {
      render(
        <Badge asChild variant="destructive">
          <a href="/test">Link Badge</a>
        </Badge>,
      );

      const badge = screen.getByRole("link", { name: "Link Badge" });
      expect(badge).toHaveClass("bg-destructive");
      expect(badge).toHaveClass("rounded-full");
    });

    it("preserves child props when asChild is true", () => {
      render(
        <Badge asChild>
          <button type="submit" disabled>
            Disabled Button
          </button>
        </Badge>,
      );

      const badge = screen.getByRole("button", { name: "Disabled Button" });
      expect(badge).toHaveAttribute("type", "submit");
      expect(badge).toBeDisabled();
    });
  });

  describe("Content Types", () => {
    it("renders with text content", () => {
      render(<Badge>Simple Text</Badge>);

      expect(screen.getByText("Simple Text")).toBeInTheDocument();
    });

    it("renders with number content", () => {
      render(<Badge>{42}</Badge>);

      expect(screen.getByText("42")).toBeInTheDocument();
    });

    it("renders with icon and text", () => {
      render(
        <Badge>
          <svg data-testid="badge-icon" />
          <span>With Icon</span>
        </Badge>,
      );

      expect(screen.getByTestId("badge-icon")).toBeInTheDocument();
      expect(screen.getByText("With Icon")).toBeInTheDocument();
    });

    it("renders with only icon", () => {
      render(
        <Badge>
          <svg data-testid="icon-only" aria-label="Icon badge" />
        </Badge>,
      );

      expect(screen.getByTestId("icon-only")).toBeInTheDocument();
    });

    it("renders with React elements", () => {
      render(
        <Badge>
          <strong>Bold</strong> and <em>italic</em>
        </Badge>,
      );

      expect(screen.getByText("Bold")).toBeInTheDocument();
      expect(screen.getByText("italic")).toBeInTheDocument();
    });
  });

  describe("Multiple Badges", () => {
    it("renders multiple badges with different variants", () => {
      render(
        <div>
          <Badge>Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="destructive">Destructive</Badge>
          <Badge variant="outline">Outline</Badge>
        </div>,
      );

      expect(screen.getByText("Default")).toBeInTheDocument();
      expect(screen.getByText("Secondary")).toBeInTheDocument();
      expect(screen.getByText("Destructive")).toBeInTheDocument();
      expect(screen.getByText("Outline")).toBeInTheDocument();
    });

    it("each badge maintains its own styling", () => {
      render(
        <div>
          <Badge variant="default">Badge 1</Badge>
          <Badge variant="destructive">Badge 2</Badge>
        </div>,
      );

      const badge1 = screen.getByText("Badge 1");
      const badge2 = screen.getByText("Badge 2");

      expect(badge1).toHaveClass("bg-primary");
      expect(badge2).toHaveClass("bg-destructive");
    });
  });

  describe("Edge Cases", () => {
    it("handles empty content", () => {
      render(<Badge data-testid="empty-badge"></Badge>);

      const badge = screen.getByTestId("empty-badge");
      expect(badge).toBeInTheDocument();
      expect(badge).toBeEmptyDOMElement();
    });

    it("handles very long text", () => {
      const longText = "This is a very long badge text that might overflow";
      render(<Badge>{longText}</Badge>);

      expect(screen.getByText(longText)).toBeInTheDocument();
    });

    it("handles special characters", () => {
      render(<Badge>@#$%^&*()</Badge>);

      expect(screen.getByText("@#$%^&*()")).toBeInTheDocument();
    });

    it("handles unicode characters", () => {
      render(<Badge>🎉 Success!</Badge>);

      expect(screen.getByText("🎉 Success!")).toBeInTheDocument();
    });

    it("handles zero as content", () => {
      render(<Badge>{0}</Badge>);

      expect(screen.getByText("0")).toBeInTheDocument();
    });

    it.skip("handles whitespace-only content", () => {
      render(<Badge> </Badge>);

      const badge = screen.getByText(/^\s+$/);
      expect(badge).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("supports aria-label", () => {
      render(<Badge aria-label="Status badge">New</Badge>);

      const badge = screen.getByLabelText("Status badge");
      expect(badge).toBeInTheDocument();
    });

    it("supports aria-describedby", () => {
      render(
        <div>
          <Badge aria-describedby="badge-description">Info</Badge>
          <span id="badge-description">Additional information</span>
        </div>,
      );

      const badge = screen.getByText("Info");
      expect(badge).toHaveAttribute("aria-describedby", "badge-description");
    });

    it("supports role attribute", () => {
      render(<Badge role="status">Loading...</Badge>);

      const badge = screen.getByRole("status");
      expect(badge).toBeInTheDocument();
    });

    it("is keyboard accessible when used as button", () => {
      render(
        <Badge asChild>
          <button type="button">Clickable</button>
        </Badge>,
      );

      const badge = screen.getByRole("button");
      badge.focus();
      expect(badge).toHaveFocus();
    });

    it("supports tabIndex", () => {
      render(<Badge tabIndex={0}>Focusable</Badge>);

      const badge = screen.getByText("Focusable");
      expect(badge).toHaveAttribute("tabIndex", "0");
    });
  });

  describe("Event Handlers", () => {
    it("handles onClick when used as button", () => {
      const handleClick = jest.fn();

      render(
        <Badge asChild>
          <button type="button" onClick={handleClick}>
            Click me
          </button>
        </Badge>,
      );

      const badge = screen.getByRole("button");
      badge.click();

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("handles onClick on span with tabIndex", () => {
      const handleClick = jest.fn();

      render(
        <Badge onClick={handleClick} tabIndex={0}>
          Clickable Badge
        </Badge>,
      );

      const badge = screen.getByText("Clickable Badge");
      badge.click();

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("handles onMouseEnter and onMouseLeave", () => {
      const handleMouseEnter = jest.fn();
      const handleMouseLeave = jest.fn();

      render(
        <Badge onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
          Hover me
        </Badge>,
      );

      const badge = screen.getByText("Hover me");

      // Trigger mouse events using fireEvent
      fireEvent.mouseEnter(badge);
      expect(handleMouseEnter).toHaveBeenCalledTimes(1);

      fireEvent.mouseLeave(badge);
      expect(handleMouseLeave).toHaveBeenCalledTimes(1);
    });
  });

  describe("Integration", () => {
    it("works as a link badge", () => {
      render(
        <Badge asChild variant="secondary">
          <a href="/profile">View Profile</a>
        </Badge>,
      );

      const link = screen.getByRole("link", { name: "View Profile" });
      expect(link).toHaveAttribute("href", "/profile");
      expect(link).toHaveClass("bg-secondary");
    });

    it("works as a button badge with variant", () => {
      render(
        <Badge asChild variant="destructive">
          <button type="button">Delete</button>
        </Badge>,
      );

      const button = screen.getByRole("button", { name: "Delete" });
      expect(button).toHaveClass("bg-destructive");
    });

    it("combines with custom classes and variants", () => {
      render(
        <Badge variant="outline" className="text-lg px-4">
          Custom
        </Badge>,
      );

      const badge = screen.getByText("Custom");
      expect(badge).toHaveClass("text-foreground"); // From outline variant
      expect(badge).toHaveClass("text-lg"); // Custom class
      expect(badge).toHaveClass("px-4"); // Custom class
    });
  });
});
