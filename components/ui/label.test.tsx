import { render, screen } from "@testing-library/react";
import { Label } from "@/components/ui/label";

describe("Label", () => {
  it("renders correctly with children", () => {
    render(<Label>Username</Label>);
    const label = screen.getByTestId("label");
    expect(label).toBeInTheDocument();
    expect(label).toHaveTextContent("Username");
    expect(label).toHaveAttribute("data-slot", "label");
  });

  it("applies custom className", () => {
    render(<Label className="custom-class">Username</Label>);
    const label = screen.getByTestId("label");
    expect(label).toHaveClass("custom-class");
  });

  it("forwards htmlFor prop correctly", () => {
    render(<Label htmlFor="username">Username</Label>);
    const label = screen.getByTestId("label");
    expect(label).toHaveAttribute("for", "username");
  });

  it("forwards additional props", () => {
    render(<Label title="Help text">Username</Label>);
    const label = screen.getByTestId("label");
    expect(label).toHaveAttribute("title", "Help text");
  });
});
