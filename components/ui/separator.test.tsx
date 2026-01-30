import { render, screen } from "@testing-library/react";
import { Separator } from "@/components/ui/separator";

describe("Separator", () => {
  it("renders correctly with default props", () => {
    render(<Separator />);
    const separator = screen.getByTestId("separator");
    expect(separator).toBeInTheDocument();
    expect(separator).toHaveAttribute("data-slot", "separator");
    expect(separator).toHaveAttribute("data-orientation", "horizontal");
  });

  it("renders with vertical orientation", () => {
    render(<Separator orientation="vertical" />);
    const separator = screen.getByTestId("separator");
    expect(separator).toHaveAttribute("data-orientation", "vertical");
  });

  it("adds accessibility attributes when decorative is false", () => {
    render(<Separator decorative={false} orientation="vertical" />);
    const separator = screen.getByTestId("separator");
    expect(separator).toHaveAttribute("role", "separator");
    expect(separator).toHaveAttribute("aria-orientation", "vertical");
  });

  it("is hidden from accessibility tree when decorative is true", () => {
    render(<Separator decorative={true} />);
    const separator = screen.getByTestId("separator");
    expect(separator).not.toHaveAttribute("role", "separator");
  });

  it("applies custom className", () => {
    render(<Separator className="custom-class" />);
    const separator = screen.getByTestId("separator");
    expect(separator).toHaveClass("custom-class");
  });

  it("forwards additional props", () => {
    render(<Separator id="test-id" title="Separator Title" />);
    const separator = screen.getByTestId("separator");
    expect(separator).toHaveAttribute("id", "test-id");
    expect(separator).toHaveAttribute("title", "Separator Title");
  });
});
