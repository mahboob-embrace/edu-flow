import { render, screen } from "@testing-library/react";
import { Button } from "@/components/ui/button";

describe("Button", () => {
  describe("variants", () => {
    it("renders with default variant", () => {
      render(<Button data-testid="button">Click me</Button>);
      const button = screen.getByTestId("button");
      expect(button).toBeInTheDocument();
      expect(button).toHaveAttribute("data-variant", "default");
    });

    it("renders with destructive variant", () => {
      render(<Button variant="destructive">Delete</Button>);
      const button = screen.getByRole("button", { name: /delete/i });
      expect(button).toBeInTheDocument();
      expect(button).toHaveAttribute("data-variant", "destructive");
    });

    it("renders with outline variant", () => {
      render(<Button variant="outline">Outline</Button>);
      const button = screen.getByRole("button", { name: /outline/i });
      expect(button).toBeInTheDocument();
      expect(button).toHaveAttribute("data-variant", "outline");
    });

    it("renders with secondary variant", () => {
      render(<Button variant="secondary">Secondary</Button>);
      const button = screen.getByRole("button", { name: /secondary/i });
      expect(button).toBeInTheDocument();
      expect(button).toHaveAttribute("data-variant", "secondary");
    });

    it("renders with ghost variant", () => {
      render(<Button variant="ghost">Ghost</Button>);
      const button = screen.getByRole("button", { name: /ghost/i });
      expect(button).toBeInTheDocument();
      expect(button).toHaveAttribute("data-variant", "ghost");
    });

    it("renders with link variant", () => {
      render(<Button variant="link">Link</Button>);
      const button = screen.getByRole("button", { name: /link/i });
      expect(button).toBeInTheDocument();
      expect(button).toHaveAttribute("data-variant", "link");
    });
  });

  describe("sizes", () => {
    it("renders with default size", () => {
      render(<Button>Default Size</Button>);
      const button = screen.getByRole("button", { name: /default size/i });
      expect(button).toHaveAttribute("data-size", "default");
    });

    it("renders with sm size", () => {
      render(<Button size="sm">Small</Button>);
      const button = screen.getByRole("button", { name: /small/i });
      expect(button).toHaveAttribute("data-size", "sm");
    });

    it("renders with lg size", () => {
      render(<Button size="lg">Large</Button>);
      const button = screen.getByRole("button", { name: /large/i });
      expect(button).toHaveAttribute("data-size", "lg");
    });

    it("renders with icon size", () => {
      render(
        <Button size="icon" aria-label="Icon button">
          ★
        </Button>,
      );
      const button = screen.getByRole("button", { name: /icon button/i });
      expect(button).toHaveAttribute("data-size", "icon");
    });

    it("renders with icon-sm size", () => {
      render(
        <Button size="icon-sm" aria-label="Small icon">
          ★
        </Button>,
      );
      const button = screen.getByRole("button", { name: /small icon/i });
      expect(button).toHaveAttribute("data-size", "icon-sm");
    });

    it("renders with icon-lg size", () => {
      render(
        <Button size="icon-lg" aria-label="Large icon">
          ★
        </Button>,
      );
      const button = screen.getByRole("button", { name: /large icon/i });
      expect(button).toHaveAttribute("data-size", "icon-lg");
    });
  });

  describe("asChild prop", () => {
    it("renders as a child element when asChild is true", () => {
      render(
        <Button asChild>
          <a href="/test">Link Button</a>
        </Button>,
      );
      const link = screen.getByRole("link", { name: /link button/i });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute("href", "/test");
      expect(link).toHaveAttribute("data-slot", "button");
    });

    it("applies button styles to child element", () => {
      render(
        <Button asChild variant="destructive" size="lg">
          <a href="/delete">Delete Link</a>
        </Button>,
      );
      const link = screen.getByRole("link", { name: /delete link/i });
      expect(link).toHaveAttribute("data-variant", "destructive");
      expect(link).toHaveAttribute("data-size", "lg");
    });

    it("renders as button when asChild is false", () => {
      render(<Button asChild={false}>Regular Button</Button>);
      const button = screen.getByRole("button", { name: /regular button/i });
      expect(button).toBeInTheDocument();
      expect(button.tagName).toBe("BUTTON");
    });
  });

  describe("className and props", () => {
    it("applies custom className", () => {
      render(<Button className="custom-class">Styled</Button>);
      const button = screen.getByRole("button", { name: /styled/i });
      expect(button).toHaveClass("custom-class");
    });

    it("renders as disabled when disabled prop is passed", () => {
      render(
        <Button data-testid="disabled-btn" disabled>
          Disabled
        </Button>,
      );
      const button = screen.getByTestId("disabled-btn");
      expect(button).toBeDisabled();
    });

    it("forwards additional props to the button element", () => {
      render(
        <Button type="submit" data-testid="submit-btn">
          Submit
        </Button>,
      );
      const button = screen.getByTestId("submit-btn");
      expect(button).toHaveAttribute("type", "submit");
    });
  });
});
