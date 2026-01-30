import { render, screen } from "@testing-library/react";
import { Input } from "@/components/ui/input";

describe("Input", () => {
  it("renders correctly with default props", () => {
    render(<Input placeholder="Enter text" />);
    const input = screen.getByTestId("input");
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("placeholder", "Enter text");
    expect(input).toHaveAttribute("data-slot", "input");
  });

  it("renders with different types", () => {
    const { rerender } = render(<Input type="text" />);
    let input = screen.getByTestId("input");
    expect(input).toHaveAttribute("type", "text");

    rerender(<Input type="password" />);
    input = screen.getByTestId("input");
    expect(input).toHaveAttribute("type", "password");

    rerender(<Input type="email" />);
    input = screen.getByTestId("input");
    expect(input).toHaveAttribute("type", "email");

    rerender(<Input type="number" />);
    input = screen.getByTestId("input");
    expect(input).toHaveAttribute("type", "number");
  });

  it("applies custom className", () => {
    render(<Input className="custom-class" />);
    const input = screen.getByTestId("input");
    expect(input).toHaveClass("custom-class");
  });

  it("renders as disabled when disabled prop is passed", () => {
    render(<Input disabled />);
    const input = screen.getByTestId("input");
    expect(input).toBeDisabled();
  });

  it("forwards additional props to the input element", () => {
    render(<Input name="test-input" id="test-id" required />);
    const input = screen.getByTestId("input");
    expect(input).toHaveAttribute("name", "test-input");
    expect(input).toHaveAttribute("id", "test-id");
    expect(input).toBeRequired();
  });

  it("can be used with a label", () => {
    render(
      <div>
        <label htmlFor="email">Email</label>
        <Input id="email" type="email" />
      </div>,
    );
    const input = screen.getByLabelText(/email/i);
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("type", "email");
  });
});
